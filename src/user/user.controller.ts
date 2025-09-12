import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return {
      message: 'Utilisateur créé avec succès',
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        profil: user.profil,
      },
    };
  }

@Post('login')
async login(@Body() body: { identifier: string; pswd: string }) {
  const { identifier, pswd } = body;
  return this.userService.login(identifier, pswd);
}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
