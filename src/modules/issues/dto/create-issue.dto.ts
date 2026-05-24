import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIssueDto {
  @ApiProperty({ example: 'Login page crashes on submit', maxLength: 150 })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title!: string;

  @ApiProperty({
    example: 'Clicking the login button causes a 500 error when the email field is empty.',
    minLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(20, { message: 'description must be at least 20 characters' })
  description!: string;

  @ApiProperty({ enum: ['bug', 'feature_request'], example: 'bug' })
  @IsIn(['bug', 'feature_request'], {
    message: 'type must be one of: bug, feature_request',
  })
  type!: 'bug' | 'feature_request';
}
