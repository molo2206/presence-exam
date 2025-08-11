import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.pswd, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        pswd: hashedPassword,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        profil: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        profil: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        email: true,
        profil: true,
      },
    });
    if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.pswd) {
      updateUserDto.pswd = await bcrypt.hash(updateUserDto.pswd, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        full_name: true,
        email: true,
        profil: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: `Utilisateur ${id} supprimé avec succès` };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isPasswordValid = await bcrypt.compare(password, user.pswd);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const payload = { sub: user.id, email: user.email };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const { pswd, ...result } = user;
    return { user: result, access_token: token };
  }
}
