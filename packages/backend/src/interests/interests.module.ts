import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [InterestsController],
  providers: [PrismaService, InterestsService],
})
export class InterestsModule {}
