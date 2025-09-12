import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  // Créer une promotion
  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  // Récupérer toutes les promotions
  @Get()
  findAll() {
    return this.promotionService.findAll();
  }

  // Récupérer une promotion par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id); // garder string
  }

  // Mettre à jour une promotion
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updatePromotionDto); // garder string
  }

  // Supprimer une promotion
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id); // garder string
  }
}
