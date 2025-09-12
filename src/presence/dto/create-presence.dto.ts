// src/presence/dto/create-presence.dto.ts
import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreatePresenceDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  examId: string;

  @IsOptional()
  @IsDateString()
  timestamp?: string; // si non fourni, Prisma utilisera le default now()
}
