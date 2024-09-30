import { OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { usernameRegexr } from 'src/constants/regexr';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'password'
]) {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  @Matches(usernameRegexr, {
    message:
      'username must be 4-15 characters long, contain only letters, numbers, and underscores, and cannot be all numbers.'
  })
  username: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsUrl()
  coverPhoto: string;

  @IsOptional()
  @IsString()
  dayOfbirth: string;
}
