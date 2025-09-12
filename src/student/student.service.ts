import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { generateMatricule } from 'utility/GererMatrile';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStudentDto: CreateStudentDto & { promotionName?: string; recessName?: string },
  ) {
    let promotionId = createStudentDto.promotionId;

    if (!promotionId && createStudentDto.promotionName) {
      const promotion = await this.prisma.promotion.findFirst({
        where: { name: createStudentDto.promotionName },
      });
      if (!promotion) throw new NotFoundException('Promotion introuvable');
      promotionId = promotion.id;
    }

    let recessId = createStudentDto.recessId;
    if (!recessId && createStudentDto.recessName) {
      const recess = await this.prisma.recess.findFirst({
        where: { name: createStudentDto.recessName },
      });
      if (!recess) throw new NotFoundException('Récréation introuvable');
      recessId = recess.id;
    }

    if (!promotionId) throw new BadRequestException('Promotion non spécifiée');

    const matricule = generateMatricule();

    const fingerprint = createStudentDto.fingerprint?.trim() || matricule;

    const existing = await this.prisma.student.findFirst({ where: { fingerprint } });
    if (existing)
      throw new BadRequestException('Cette empreinte/matricule est déjà enregistrée');

    // 🔹 PAS DE TYPO explicite, Prisma infère le type automatiquement
    const data = {
      fullName: createStudentDto.fullName,
      matricule,
      fingerprint,
      gender: createStudentDto.gender,
      placeOfBirth: createStudentDto.placeOfBirth,
      phone: createStudentDto.phone,
      dateOfBirth: createStudentDto.dateOfBirth
        ? new Date(createStudentDto.dateOfBirth)
        : undefined,
      promotion: { connect: { id: promotionId } },
      ...(recessId && { recess: { connect: { id: recessId } } }),
    };

    try {
      const student = await this.prisma.student.create({ data });
      return { message: 'Étudiant créé avec succès', data: student };
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la création de l’étudiant');
    }
  }

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: { promotion: true, presences: true, recess: true },
    });
    return { message: 'Liste des étudiants', data: students };
  }

  // Récupérer un étudiant par id
  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { promotion: true, presences: true, recess: true },
    });
    if (!student) throw new NotFoundException('Étudiant introuvable');
    return { message: 'Étudiant trouvé', data: student };
  }

  // Mettre à jour un étudiant
  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const exist = await this.prisma.student.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException('Étudiant introuvable');

    // Créer un objet "data" ne contenant que les champs définis
    const data: any = { ...updateStudentDto };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const student = await this.prisma.student.update({
      where: { id },
      data,
    });

    return { message: 'Étudiant mis à jour', data: student };
  }

  // Supprimer un étudiant
  async remove(id: string) {
    const exist = await this.prisma.student.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException('Étudiant introuvable');

    const student = await this.prisma.student.delete({
      where: { id },
    });
    return { message: 'Étudiant supprimé', data: student };
  }
}
