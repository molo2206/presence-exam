import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer une promotion
  async create(createPromotionDto: CreatePromotionDto) {
    const promotion = await this.prisma.promotion.create({
      data: createPromotionDto,
    });
    return { message: 'Promotion créée avec succès', data: promotion };
  }

  // Récupérer toutes les promotions
  async findAll() {
    const promotions = await this.prisma.promotion.findMany({
      include: { students: true, section: true },
    });
    return { message: 'Liste des promotions', data: promotions };
  }

  // Récupérer une promotion par ID
  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: { students: true, section: true },
    });
    if (!promotion) throw new NotFoundException('Promotion introuvable');
    return { message: 'Promotion trouvée', data: promotion };
  }

  // Mettre à jour une promotion
  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: updatePromotionDto,
    });
    return { message: 'Promotion mise à jour', data: promotion };
  }

  // Supprimer une promotion
  async remove(id: string) {
    const promotion = await this.prisma.promotion.delete({
      where: { id },
    });
    return { message: 'Promotion supprimée', data: promotion };
  }
}
