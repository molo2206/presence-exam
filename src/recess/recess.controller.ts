import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecessService } from './recess.service';
import { CreateRecessDto } from './dto/create-recess.dto';
import { UpdateRecessDto } from './dto/update-recess.dto';

@Controller('recess')
export class RecessController {
  constructor(private readonly recessService: RecessService) {}

  @Post()
  create(@Body() createRecessDto: CreateRecessDto) {
    return this.recessService.create(createRecessDto);
  }

  @Get()
  findAll() {
    return this.recessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recessService.findOne(id); // id reste string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecessDto: UpdateRecessDto) {
    return this.recessService.update(id, updateRecessDto); // id reste string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recessService.remove(id); // id reste string
  }
}
