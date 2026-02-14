import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApprovalStatus } from '../common/enums/approval-status.enum';

@Entity('approval_requests')
export class ApprovalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.approvalRequests, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'requested_role_code' })
  requestedRoleCode: string;

  @Column({ type: 'varchar', default: ApprovalStatus.PENDING })
  status: ApprovalStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User, (user) => user.reviewedApprovals, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: User;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
