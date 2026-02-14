import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleCode } from '../common/enums/role-code.enum';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/interfaces/auth-user.interface';
import { ApprovalStatus } from '../common/enums/approval-status.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleCode.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('approvals')
  approvals(@Query('status') status?: ApprovalStatus) {
    return this.adminService.listApprovals(status);
  }

  @Post('approvals/:id/review')
  reviewApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewApprovalDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.adminService.reviewApproval(id, dto, user);
  }

  @Get('users')
  users() {
    return this.adminService.listUsers();
  }

  @Get('news')
  news() {
    return this.adminService.listNews();
  }

  @Post('news')
  createNews(@Body() dto: CreateNewsDto, @CurrentUser() user: AuthUser) {
    return this.adminService.createNews(dto, user);
  }

  @Patch('news/:id')
  updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.adminService.updateNews(id, dto, user);
  }

  @Patch('news/:id/publish')
  publishNews(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.adminService.publishNews(id, user);
  }

  @Patch('news/:id/unpublish')
  unpublishNews(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.adminService.unpublishNews(id, user);
  }
}
