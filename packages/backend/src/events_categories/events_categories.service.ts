import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventsCategoryDto } from './dto/create-events_category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events_category.dto';
import { PrismaService } from 'src/database';
//import { Prisma, users_roles } from '@prisma/client';

@Injectable()
export class EventsCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateEventsCategoryDto) {
    try {
      const category = await this.prisma.eventsCategories.create({
        data: createCategoryDto,
      });
      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating category: ' + error.message,
      );
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.eventsCategories.findMany();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.eventsCategories.findFirst({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`There is no category with ID: ${id}.`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateEventsCategoryDto: UpdateEventsCategoryDto) {
    try {
      // Validate category existence
      const categoryToUpdate = await this.findOne(id);

      if (categoryToUpdate) {
        // Update category information
        const updatedCategory = await this.prisma.eventsCategories.update({
          where: { id },
          data: updateEventsCategoryDto,
        });

        return updatedCategory;
      } else {
        throw new NotFoundException(`Category with ID: ${id} not found.`);
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating category: ' + error.message,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} eventsCategory`;
  }
}
