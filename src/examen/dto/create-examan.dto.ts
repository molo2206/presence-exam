import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExamanDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
