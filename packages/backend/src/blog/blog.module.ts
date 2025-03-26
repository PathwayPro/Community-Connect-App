import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [BlogController],
  providers: [PrismaService, FilesService, BlogService],
})
export class BlogModule {}
