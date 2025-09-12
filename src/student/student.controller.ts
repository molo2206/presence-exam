import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Créer un étudiant
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }
  
  // Récupérer tous les étudiants
  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  // Récupérer un étudiant par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id); // garder string
  }

  // Mettre à jour un étudiant
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto); // garder string
  }

  // Supprimer un étudiant
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id); // garder string
  }
}
