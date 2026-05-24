import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(20, { message: 'description must be at least 20 characters' })
  description!: string;

  @IsIn(['bug', 'feature_request'], {
    message: 'type must be one of: bug, feature_request',
  })
  type!: 'bug' | 'feature_request';
}
