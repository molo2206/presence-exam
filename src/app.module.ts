import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { SectionModule } from './section/section.module';
import { PromotionModule } from './promotion/promotion.module';
import { ExamenModule } from './examen/examen.module';
import { PresenceModule } from './presence/presence.module';

@Module({
  imports: [UserModule, StudentModule, SectionModule, PromotionModule, ExamenModule, PresenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
