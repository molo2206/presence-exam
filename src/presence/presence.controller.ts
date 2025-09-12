import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PresenceService } from './presence.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  create(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.create(createPresenceDto);
  }

  @Get()
  findAll() {
    return this.presenceService.findAll();
  }

  @Get('filtered')
  async findFiltered(
    @Query('date') date?: string,
    @Query('promotionId') promotionId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('vacationId') vacationId?: string,
    @Query('examId') examId?: string,
  ) {
    let parsedDate: Date | undefined;

    if (date) {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('La date fournie est invalide.');
      }
    }
    const presences = await this.presenceService.findFiltered(
      parsedDate,
      promotionId,
      sessionId,
      vacationId,
      examId,
    );

    if (!presences || presences.length === 0) {
      return {
        message: 'Aucune présence trouvée.',
        data: [],
      };
    }

    return {
      message: 'Liste des présences filtrées.',
      data: presences,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presenceService.findOne(id); // id reste string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresenceDto: UpdatePresenceDto) {
    return this.presenceService.update(id, updatePresenceDto); // id reste string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presenceService.remove(id); // id reste string
  }
}
