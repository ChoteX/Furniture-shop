import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewApprovalDto {
  @IsIn(['approve', 'reject'])
  action: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  notes?: string;
}
