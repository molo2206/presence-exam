import { PartialType } from '@nestjs/mapped-types';
import { CreateRecessDto } from './create-recess.dto';

export class UpdateRecessDto extends PartialType(CreateRecessDto) {}
