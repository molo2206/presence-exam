import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecessDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // <-- transforme la chaîne en Date
  startTime?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // <-- transforme la chaîne en Date
  endTime?: Date;
}
