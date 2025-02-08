import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [NewsController],
  providers: [PrismaService, NewsService, FilesService],
})
export class NewsModule {}
