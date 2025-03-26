import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FilterNewsDto } from './dto/filter-news.dto';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  getFormattedFilters(filters: FilterNewsDto): Prisma.NewsWhereInput {
    const formattedFilters: Prisma.NewsWhereInput = {};

    if (filters?.title) {
      formattedFilters.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }
    if (filters?.details) {
      formattedFilters.details = {
        contains: filters.details,
        mode: 'insensitive',
      };
    }
    if (filters?.published) {
      formattedFilters.published =
        filters.published === true || filters.published === 'true';
    }
    if (filters?.user_id) {
      formattedFilters.user_id = filters.user_id;
    }
    if (filters?.date_from && filters?.date_to) {
      formattedFilters.created_at = {
        gte: filters.date_from,
        lte: filters.date_to,
      };
    } else if (filters?.date_from) {
      formattedFilters.created_at = {
        gte: filters.date_from,
      };
    } else if (filters?.date_to) {
      formattedFilters.created_at = {
        lte: filters.date_to,
      };
    }

    console.log('APPLIED FILTERS:', formattedFilters);

    return formattedFilters;
  }

  async uploadImage(file: Express.Multer.File) {
    // UPLOAD IMAGE TO GET THE LINK
    const imageLink = await this.filesService.upload(
      FileValidationEnum.NEWS,
      file,
    );
    if (!imageLink) {
      throw new InternalServerErrorException(
        'There was a problem uploading the image. Please try again later',
      );
    }
    return imageLink;
  }

  async create(
    user_id: number,
    createNewsDto: CreateNewsDto,
    file: Express.Multer.File,
  ) {
    try {
      const image = file ? await this.uploadImage(file) : null;

      const data = {
        ...createNewsDto,
        created_at: new Date(),
        updated_at: new Date(),
        image: image ? image.path + '/' + image.fileName : null,
        user: {
          connect: { id: user_id },
        },
      };

      const newNews = await this.prisma.news.create({ data });

      return newNews;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating the news: ' + error.message,
      );
    }
  }

  async findAll(filters: FilterNewsDto) {
    try {
      const formattedFilters: Prisma.NewsWhereInput =
        this.getFormattedFilters(filters);

      const filteredNews = this.prisma.news.findMany({
        where: formattedFilters,
      });

      return filteredNews;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching news: ' + error.message,
      );
    }
  }

  async findOnePublic(id: number) {
    try {
      const where: Prisma.NewsWhereInput = {
        id: id,
        published: true,
      };

      const news = await this.prisma.news.findFirst({ where });

      if (!news) {
        throw new NotFoundException(`There is no News with ID #${id}`);
      }

      return news;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching news with ID #${id}:`,
        error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const news = await this.prisma.news.findFirst({ where: { id } });

      if (!news) {
        throw new NotFoundException(`There is no News with ID #${id}`);
      }

      return news;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching news with ID #${id}:`,
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    file: Express.Multer.File,
  ) {
    try {
      // Validate News exist
      const newsToUpdate = await this.findOne(id);
      if (!newsToUpdate) {
        throw new NotFoundException(`There is no News with ID #${id}`);
      }

      // Get image link if there is one
      const image = file ? await this.uploadImage(file) : null;

      // Update news information
      const data = {
        ...updateNewsDto,
        updated_at: new Date(),
        image: image ? image.path + '/' + image.fileName : null,
      };

      const updatedNews = await this.prisma.news.update({
        where: { id },
        data: data,
      });

      return updatedNews;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating news with ID #${id}:`,
        error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      // VALIDATE NEWS EXIST
      const newsToDelete = await this.findOne(id);
      if (!newsToDelete) {
        throw new NotFoundException(
          `There is no News with ID #${id} to delete`,
        );
      }

      const deletedNews = await this.prisma.news.delete({ where: { id } });

      return deletedNews;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
