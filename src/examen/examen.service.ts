import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamanDto } from './dto/create-examan.dto';
import { UpdateExamanDto } from './dto/update-examan.dto';

@Injectable()
export class ExamenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExamanDto) {
    try {
      const exam = await this.prisma.exam.create({
        data: {
          name: dto.name,
          date: new Date(dto.date),
          sessionId: dto.sessionId,
        },
        include: { session: true },
      });
      return { message: 'Examen créé avec succès', data: exam };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création de l’examen');
    }
  }

  async findAll() {
    const exams = await this.prisma.exam.findMany({
      include: {
        session: true,
        presences: {
          include: { student: { include: { promotion: { include: { section: true } } } } },
        },
      },
      orderBy: { date: 'desc' },
    });
    return { message: 'Liste des examens', data: exams };
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        session: true,
        presences: {
          include: { student: { include: { promotion: { include: { section: true } } } } },
        },
      },
    });
    if (!exam) throw new NotFoundException(`Examen #${id} introuvable`);
    return { message: 'Examen trouvé', data: exam };
  }

  async update(id: string, dto: UpdateExamanDto) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException(`Examen #${id} introuvable`);

    const updated = await this.prisma.exam.update({
      where: { id },
      data: {
        name: dto.name ?? exam.name,
        date: dto.date ? new Date(dto.date) : exam.date,
        sessionId: dto.sessionId ?? exam.sessionId,
      },
      include: { session: true },
    });
    return { message: 'Examen mis à jour', data: updated };
  }

  async remove(id: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException(`Examen #${id} introuvable`);

    await this.prisma.exam.delete({ where: { id } });
    return { message: 'Examen supprimé avec succès' };
  }

  /** Ajouter un étudiant à un examen (présence) */
  async addPresence(examId: string, studentId: string) {
    try {
      const presence = await this.prisma.presence.create({
        data: {
          examId,
          studentId,
        },
        include: { student: true, exam: true },
      });
      return { message: 'Présence enregistrée', data: presence };
    } catch (error) {
      throw new BadRequestException('Erreur lors de l’enregistrement de la présence');
    }
  }

  /** Récupérer la liste des étudiants présents à un examen */
  async getPresences(examId: string) {
    const presences = await this.prisma.presence.findMany({
      where: { examId },
      include: {
        student: { include: { promotion: { include: { section: true } } } },
      },
    });
    return { message: 'Liste des présences', data: presences };
  }
}
