import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  pswd: string;

  @IsOptional()
  profil?: string;
}
