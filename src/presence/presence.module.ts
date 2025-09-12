import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { PresenceGateway } from './presence.gateway'; 
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway, PrismaService], 
})
export class PresenceModule {}
