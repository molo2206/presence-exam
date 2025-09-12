import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecessDto } from './dto/create-recess.dto';
import { UpdateRecessDto } from './dto/update-recess.dto';

@Injectable()
export class RecessService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un recess
  async create(createRecessDto: CreateRecessDto) {
    const recess = await this.prisma.recess.create({
      data: createRecessDto,
    });
    return { message: 'Recess créé avec succès', data: recess };
  }

  // Récupérer tous les recess
  async findAll() {
    const recessList = await this.prisma.recess.findMany({
      include: { students: true }, // Inclut les étudiants associés
    });
    return { message: 'Liste des recess', data: recessList };
  }

  // Récupérer un recess par ID
  async findOne(id: string) {
    const recess = await this.prisma.recess.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!recess) throw new NotFoundException('Recess introuvable');
    return { message: 'Recess trouvé', data: recess };
  }

  // Mettre à jour un recess
  async update(id: string, updateRecessDto: UpdateRecessDto) {
    const existing = await this.prisma.recess.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Recess introuvable');

    const recess = await this.prisma.recess.update({
      where: { id },
      data: updateRecessDto,
    });
    return { message: 'Recess mis à jour', data: recess };
  }

  // Supprimer un recess
  async remove(id: string) {
    const existing = await this.prisma.recess.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Recess introuvable');

    const recess = await this.prisma.recess.delete({
      where: { id },
    });
    return { message: 'Recess supprimé', data: recess };
  }
}
