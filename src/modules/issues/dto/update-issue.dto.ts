import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MinLength(20, { message: 'description must be at least 20 characters' })
  description?: string;

  @IsOptional()
  @IsIn(['bug', 'feature_request'], {
    message: 'type must be one of: bug, feature_request',
  })
  type?: 'bug' | 'feature_request';
}
