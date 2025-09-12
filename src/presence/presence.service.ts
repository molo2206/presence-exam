import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { PresenceGateway } from './presence.gateway';

@Injectable()
export class PresenceService {
  constructor(
    private prisma: PrismaService,
    private presenceGateway: PresenceGateway,
  ) {}

  // Créer une présence
  async create(createPresenceDto: CreatePresenceDto) {
    const { studentId, examId } = createPresenceDto;

    // Charger l'examen avec sa session
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { session: true },
    });
    if (!exam) throw new NotFoundException('Examen introuvable');

    // Charger l'étudiant avec sa promotion
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { promotion: true },
    });
    if (!student) throw new NotFoundException('Étudiant introuvable');

    // Vérifier s'il existe déjà une présence pour cette session et promotion
    const existing = await this.prisma.presence.findFirst({
      where: {
        studentId,
        exam: { sessionId: exam.sessionId },
        student: { promotionId: student.promotionId },
      },
      include: { exam: true, student: true },
    });

    if (existing) {
      // 🔹 Émettre sur WebSocket que la présence existe déjà
      this.presenceGateway.sendPresenceNotification({
        id: existing.id,
        student: {
          id: student.id,
          fullName: student.fullName,
          promotion: student.promotion.name,
        },
        exam: {
          id: exam.id,
          name: exam.name,
          session: exam.session?.name ?? 'Session inconnue',
        },
        createdAt: existing.timestamp as Date,
        status: 'alreadyExists', // 🔹 ajouter un statut spécifique
        message: `Présence déjà enregistrée pour ${student.fullName}`,
      });

      return {
        message: `Présence déjà enregistrée pour ${student.fullName}`,
        data: existing,
      };
    }

    // Créer la présence
    const presence = await this.prisma.presence.create({
      data: { studentId, examId },
      include: {
        student: { include: { promotion: true } },
        exam: { include: { session: true } },
      },
    });

    // Émettre sur WebSocket
    this.presenceGateway.sendPresenceNotification({
      id: presence.id,
      student: {
        id: student.id,
        fullName: student.fullName,
        promotion: student.promotion.name,
      },
      exam: {
        id: exam.id,
        name: exam.name,
        session: exam.session?.name ?? 'Session inconnue',
      },
      createdAt: presence.timestamp as Date,
      status: 'added', // 🔹 statut pour nouvelle présence
      message: `Présence ajoutée pour ${student.fullName}`,
    });

    return {
      message: `Présence ajoutée pour ${student.fullName}`,
      data: presence,
    };
  }

  // Récupérer toutes les présences
  async findAll() {
    return this.prisma.presence.findMany({
      include: {
        student: true,
        exam: true,
      },
    });
  }

  async findFiltered(
    date?: Date,
    promotionId?: string,
    sessionId?: string,
    vacationId?: string,
    examId?: string,
  ) {
    const where: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.timestamp = { gte: startOfDay, lte: endOfDay };
    }

    // Prisma ne supporte pas de filtrer sur relations imbriquées avec affectation directe
    // Il faut utiliser "some" si c'est une relation one-to-many
    if (promotionId) {
      where.student = { promotionId };
    }

    const examFilter: any = {};
    if (sessionId) examFilter.sessionId = sessionId;
    if (vacationId) examFilter.vacationId = vacationId;
    if (examId) examFilter.id = examId;

    if (Object.keys(examFilter).length > 0) {
      where.exam = examFilter;
    }

    return this.prisma.presence.findMany({
      where,
      include: {
        student: true,
        exam: true,
      },
    });
  }

  // Récupérer une présence par ID
  async findOne(id: string) {
    const presence = await this.prisma.presence.findUnique({
      where: { id },
      include: { student: true, exam: true },
    });
    if (!presence) {
      throw new NotFoundException(`Présence avec l'id ${id} non trouvée`);
    }
    return presence;
  }

  // Mettre à jour une présence
  async update(id: string, updatePresenceDto: UpdatePresenceDto) {
    const { studentId, examId } = updatePresenceDto;
    const presence = await this.prisma.presence.findUnique({ where: { id } });
    if (!presence) {
      throw new NotFoundException(`Présence avec l'id ${id} non trouvée`);
    }

    return this.prisma.presence.update({
      where: { id },
      data: {
        studentId,
        examId,
      },
      include: { student: true, exam: true },
    });
  }

  // Supprimer une présence
  async remove(id: string) {
    const presence = await this.prisma.presence.findUnique({ where: { id } });
    if (!presence) {
      throw new NotFoundException(`Présence avec l'id ${id} non trouvée`);
    }
    return this.prisma.presence.delete({ where: { id } });
  }
}
