import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ApprovalRequest } from '../entities/approval-request.entity';
import { ApprovalStatus } from '../common/enums/approval-status.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(ApprovalRequest)
    private readonly approvalRepository: Repository<ApprovalRequest>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists.');
    }

    const role = await this.roleRepository.findOne({
      where: { code: dto.requestedRole },
    });

    if (!role) {
      throw new BadRequestException('Invalid role request.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      status: UserStatus.PENDING,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    const approval = this.approvalRepository.create({
      user: savedUser,
      requestedRoleCode: dto.requestedRole,
      status: ApprovalStatus.PENDING,
    });

    await this.approvalRepository.save(approval);

    return {
      message:
        'Registration submitted. Your account will be activated after admin approval.',
      user: this.toUserResponse(savedUser),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        `Your account is currently ${user.status}. Contact administrator if needed.`,
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.code,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.toUserResponse(user),
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return this.toUserResponse(user);
  }

  private toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      role: user.role?.code,
      createdAt: user.createdAt,
    };
  }
}
