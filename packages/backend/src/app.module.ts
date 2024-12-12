import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { MentorModule } from './mentor/mentor.module';

@Module({
  imports: [MentorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
