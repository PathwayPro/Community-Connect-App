import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [SkillsController],
  providers: [PrismaService, SkillsService],
})
export class SkillsModule {}
