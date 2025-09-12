import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer une section
  async create(createSectionDto: CreateSectionDto) {
    const section = await this.prisma.section.create({
      data: createSectionDto,
    });
    return { message: 'Section créée avec succès', data: section };
  }

  // Récupérer toutes les sections
  async findAll() {
    const sections = await this.prisma.section.findMany({
      include: { promotions: true }, // Inclut les promotions associées
    });
    return { message: 'Liste des sections', data: sections };
  }

  // Récupérer une section par ID
  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { promotions: true },
    });
    if (!section) throw new NotFoundException('Section introuvable');
    return { message: 'Section trouvée', data: section };
  }

  // Mettre à jour une section
  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const existing = await this.prisma.section.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Section introuvable');

    const section = await this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
    return { message: 'Section mise à jour', data: section };
  }

  // Supprimer une section
  async remove(id: string) {
    const existing = await this.prisma.section.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Section introuvable');

    const section = await this.prisma.section.delete({ where: { id } });
    return { message: 'Section supprimée', data: section };
  }
}
