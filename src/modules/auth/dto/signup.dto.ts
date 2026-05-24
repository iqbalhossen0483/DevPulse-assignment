import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Alice Smith' })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name!: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password!: string;

  @ApiProperty({ enum: ['contributor', 'maintainer'], example: 'contributor' })
  @IsIn(['contributor', 'maintainer'], {
    message: 'role must be one of: contributor, maintainer',
  })
  role!: 'contributor' | 'maintainer';
}
