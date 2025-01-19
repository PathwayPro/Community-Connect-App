import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [NewsController],
  providers: [PrismaService,NewsService],
})
export class NewsModule {}
