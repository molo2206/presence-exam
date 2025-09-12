import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { name, startDate, endDate, description } = createSessionDto;

    const session = await this.prisma.session.create({
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return { message: 'Session créée avec succès', data: session };
  }

  async findAll() {
    const sessions = await this.prisma.session.findMany({ include: { exams: true } });
    return { message: 'Liste des sessions', data: sessions };
  }

  async findOne(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { exams: true },
    });
    if (!session) throw new NotFoundException('Session introuvable');
    return { message: 'Session trouvée', data: session };
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Session introuvable');

    const session = await this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
    return { message: 'Session mise à jour', data: session };
  }

  async remove(id: string) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Session introuvable');

    const session = await this.prisma.session.delete({ where: { id } });
    return { message: 'Session supprimée', data: session };
  }
}
