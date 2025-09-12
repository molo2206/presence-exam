import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { CreateExamanDto } from './dto/create-examan.dto';
import { UpdateExamanDto } from './dto/update-examan.dto';

@Controller('examens')
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Post()
  create(@Body() createExamanDto: CreateExamanDto) {
    return this.examenService.create(createExamanDto);
  }

  @Get('all')
  findAll() {
    return this.examenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamanDto: UpdateExamanDto) {
    return this.examenService.update(id, updateExamanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examenService.remove(id);
  }

  @Post(':examId/presences/:studentId')
  addPresence(@Param('examId') examId: string, @Param('studentId') studentId: string) {
    return this.examenService.addPresence(examId, studentId);
  }

  @Get(':examId/presences')
  getPresences(@Param('examId') examId: string) {
    return this.examenService.getPresences(examId);
  }
}
