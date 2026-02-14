import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'actor_user_id', nullable: true })
  actorUserId?: number;

  @Column()
  action: string;

  @Column({ name: 'target_type' })
  targetType: string;

  @Column({ name: 'target_id', nullable: true })
  targetId?: number;

  @Column({ name: 'metadata_json', type: 'jsonb', nullable: true })
  metadataJson?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
