import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  promotionId?: string;

  @IsOptional()
  @IsString()
  promotionName?: string; // optionnel, pour envoyer le nom

  @IsOptional()
  @IsString()
  recessId?: string;

  @IsOptional()
  @IsString()
  recessName?: string; // optionnel, pour envoyer le nom

  @IsString()
  fingerprint: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  placeOfBirth?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
