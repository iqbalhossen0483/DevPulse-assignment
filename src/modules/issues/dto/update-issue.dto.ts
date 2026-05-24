import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateIssueDto {
  @ApiPropertyOptional({ example: 'Updated issue title', maxLength: 150 })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated description with more details about the issue.',
    minLength: 20,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MinLength(20, { message: 'description must be at least 20 characters' })
  description?: string;

  @ApiPropertyOptional({ enum: ['bug', 'feature_request'], example: 'feature_request' })
  @IsOptional()
  @IsIn(['bug', 'feature_request'], {
    message: 'type must be one of: bug, feature_request',
  })
  type?: 'bug' | 'feature_request';
}
