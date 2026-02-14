import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprovalRequest, User, Role, AuditLog]),
    NewsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
