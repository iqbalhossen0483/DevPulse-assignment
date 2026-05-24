import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import type { IssueFilters } from '../../../utils/types';

export class GetIssuesQueryDto implements IssueFilters {
  @ApiPropertyOptional({ enum: ['newest', 'oldest'], example: 'newest' })
  @IsOptional()
  @IsIn(['newest', 'oldest'], { message: "sort must be 'newest' or 'oldest'" })
  sort?: 'newest' | 'oldest';

  @ApiPropertyOptional({ enum: ['bug', 'feature_request'], example: 'bug' })
  @IsOptional()
  @IsIn(['bug', 'feature_request'], {
    message: "type must be 'bug' or 'feature_request'",
  })
  type?: 'bug' | 'feature_request';

  @ApiPropertyOptional({
    enum: ['open', 'in_progress', 'resolved'],
    example: 'open',
  })
  @IsOptional()
  @IsIn(['open', 'in_progress', 'resolved'], {
    message: "status must be 'open', 'in_progress', or 'resolved'",
  })
  status?: 'open' | 'in_progress' | 'resolved';
}
