import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { ApprovalStatus } from '../common/enums/approval-status.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { NewsService } from '../news/news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AuditLog } from '../entities/audit-log.entity';
import { AuthUser } from '../common/interfaces/auth-user.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRepository: Repository<ApprovalRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly newsService: NewsService,
  ) {}

  async listApprovals(status?: ApprovalStatus) {
    const where = status ? { status } : {};
    const approvals = await this.approvalRepository.find({
      where,
      relations: ['user', 'reviewer'],
      order: { createdAt: 'ASC' },
    });

    return approvals.map((approval) => ({
      id: approval.id,
      status: approval.status,
      requestedRoleCode: approval.requestedRoleCode,
      notes: approval.notes,
      reviewedAt: approval.reviewedAt,
      user: {
        id: approval.user.id,
        fullName: approval.user.fullName,
        email: approval.user.email,
        status: approval.user.status,
      },
      reviewer: approval.reviewer
        ? {
            id: approval.reviewer.id,
            fullName: approval.reviewer.fullName,
            email: approval.reviewer.email,
          }
        : null,
    }));
  }

  async reviewApproval(id: number, dto: ReviewApprovalDto, actor: AuthUser) {
    const approval = await this.approvalRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!approval) {
      throw new NotFoundException('Approval request not found.');
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Approval request already reviewed.');
    }

    const reviewer = await this.userRepository.findOne({
      where: { id: actor.userId },
    });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found.');
    }

    if (dto.action === 'approve') {
      const role = await this.roleRepository.findOne({
        where: { code: approval.requestedRoleCode },
      });

      if (!role) {
        throw new NotFoundException('Requested role was not found.');
      }

      approval.user.role = role;
      approval.user.status = UserStatus.ACTIVE;
      approval.status = ApprovalStatus.APPROVED;
      approval.notes = dto.notes;
      approval.reviewedAt = new Date();
      approval.reviewer = reviewer;

      await this.userRepository.save(approval.user);
      await this.approvalRepository.save(approval);

      await this.log(
        actor.userId,
        'approval.approved',
        'approval_request',
        approval.id,
        {
          userId: approval.user.id,
          requestedRoleCode: approval.requestedRoleCode,
        },
      );

      return { message: 'User approved successfully.' };
    }

    approval.user.status = UserStatus.REJECTED;
    approval.status = ApprovalStatus.REJECTED;
    approval.notes = dto.notes;
    approval.reviewedAt = new Date();
    approval.reviewer = reviewer;

    await this.userRepository.save(approval.user);
    await this.approvalRepository.save(approval);

    await this.log(
      actor.userId,
      'approval.rejected',
      'approval_request',
      approval.id,
      {
        userId: approval.user.id,
        requestedRoleCode: approval.requestedRoleCode,
      },
    );

    return { message: 'User rejected successfully.' };
  }

  async listUsers() {
    const users = await this.userRepository.find({
      relations: ['role'],
      order: { id: 'ASC' },
    });
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      role: user.role.code,
      createdAt: user.createdAt,
    }));
  }

  async listNews() {
    return this.newsService.listAll();
  }

  async createNews(dto: CreateNewsDto, actor: AuthUser) {
    const post = await this.newsService.create(dto);

    if (dto.publishImmediately) {
      const published = await this.newsService.setPublished(post.id, true);
      await this.log(actor.userId, 'news.created', 'news_post', post.id, {
        titleEn: post.titleEn,
        publishImmediately: true,
      });
      return published;
    }

    await this.log(actor.userId, 'news.created', 'news_post', post.id, {
      titleEn: post.titleEn,
      publishImmediately: false,
    });

    return post;
  }

  async updateNews(id: number, dto: UpdateNewsDto, actor: AuthUser) {
    const post = await this.newsService.update(id, dto);

    await this.log(actor.userId, 'news.updated', 'news_post', id, {
      changedFields: Object.keys(dto),
    });

    return post;
  }

  async publishNews(id: number, actor: AuthUser) {
    const post = await this.newsService.setPublished(id, true);
    await this.log(actor.userId, 'news.published', 'news_post', id);
    return post;
  }

  async unpublishNews(id: number, actor: AuthUser) {
    const post = await this.newsService.setPublished(id, false);
    await this.log(actor.userId, 'news.unpublished', 'news_post', id);
    return post;
  }

  private async log(
    actorUserId: number,
    action: string,
    targetType: string,
    targetId?: number,
    metadataJson?: Record<string, unknown>,
  ) {
    const log = this.auditRepository.create({
      actorUserId,
      action,
      targetType,
      targetId,
      metadataJson,
    });
    await this.auditRepository.save(log);
  }
}
