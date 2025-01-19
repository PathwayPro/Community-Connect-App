import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [GoalsController],
  providers: [PrismaService, GoalsService],
})
export class GoalsModule {}
