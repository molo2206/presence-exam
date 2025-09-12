import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  sectionId: string; // La promotion appartient à une section
}
