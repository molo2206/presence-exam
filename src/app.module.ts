import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { SectionModule } from './section/section.module';
import { PromotionModule } from './promotion/promotion.module';
import { ExamenModule } from './examen/examen.module';
import { PresenceModule } from './presence/presence.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';
import { RecessModule } from './recess/recess.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule,
    StudentModule,
    SectionModule,
    PromotionModule,
    ExamenModule,
    PresenceModule,
    SessionModule,
    RecessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
