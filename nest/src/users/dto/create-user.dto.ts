import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 30)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 30)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
