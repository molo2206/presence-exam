import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nom de la session, ex: "2025-2026"

  @IsDateString()
  @IsOptional()
  startDate?: string; // Date de début de la session

  @IsDateString()
  @IsOptional()
  endDate?: string; // Date de fin de la session

  @IsString()
  @IsOptional()
  description?: string; // Description optionnelle de la session
}
