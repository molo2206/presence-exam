import { Module } from '@nestjs/common';
import { RecessService } from './recess.service';
import { RecessController } from './recess.controller';

@Module({
  controllers: [RecessController],
  providers: [RecessService],
})
export class RecessModule {}
