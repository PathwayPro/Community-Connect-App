import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
import { FilterEventDto } from './dto/filter-event.dto';
import { EventsCategoriesService } from 'src/events_categories/events_categories.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private categories: EventsCategoriesService,
  ) {}

  getFormattedFilters(filters: FilterEventDto): Prisma.EventsWhereInput {
    const formattedFilters: Prisma.EventsWhereInput = {};

    if (filters?.title) {
      formattedFilters.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }
    if (filters?.subtitle) {
      formattedFilters.subtitle = {
        contains: filters.subtitle,
        mode: 'insensitive',
      };
    }
    if (filters?.description) {
      formattedFilters.description = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }
    if (filters?.category_id) {
      formattedFilters.category_id = filters.category_id;
    }
    if (filters?.location) {
      formattedFilters.location = {
        contains: filters.location,
        mode: 'insensitive',
      };
    }
    if (filters?.type) {
      formattedFilters.type = filters.type;
    }
    if (filters?.accept_subscriptions) {
      formattedFilters.accept_subscriptions = filters.accept_subscriptions;
    }
    if (filters?.price) {
      formattedFilters.price = {
        lte: filters.price,
      };
    }

    return formattedFilters;
  }

  async create(createEventDto: CreateEventDto) {
    try {
      // VALIDATE CATEGORY
      const category = await this.categories.findOne(
        createEventDto.category_id,
      );
      if (!category) {
        throw new BadRequestException(
          `The category with ID #${createEventDto.category_id} was not found.`,
        );
      }

      const event = await this.prisma.events.create({
        data: createEventDto,
      });

      return event;
    } catch (error) {
      throw new BadRequestException('Error creating event: ' + error.message);
    }
  }

  async findAll(filters: FilterEventDto) {
    const appliedFilters: Prisma.EventsWhereInput =
      this.getFormattedFilters(filters);
    console.log('APPLIED FILTERS:', appliedFilters);

    try {
      const events = await this.prisma.events.findMany({
        where: appliedFilters,
        include: {
          category: true,
        },
      });
      return events;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const event = await this.prisma.events.findFirst({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!event) {
        throw new NotFoundException(`There is no event with ID: ${id}.`);
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      // Validate event existence
      const eventToUpdate = await this.findOne(id);
      if (!eventToUpdate) {
        throw new NotFoundException(`Event with ID: ${id} not found.`);
      }

      // Validate category if required
      if (updateEventDto.category_id !== undefined) {
        const category = await this.categories.findOne(
          updateEventDto.category_id,
        );
        if (!category) {
          throw new BadRequestException(
            `The category with ID #${updateEventDto.category_id} was not found.`,
          );
        }
      }

      // Update event information
      const updatedEvent = await this.prisma.events.update({
        where: { id },
        data: updateEventDto,
      });

      return updatedEvent;
    } catch (error) {
      throw new BadRequestException('Error updating event: ' + error.message);
    }
  }

  async toggleSubscription(id: number) {
    try {
      // Validate event existence
      const eventToUpdate = await this.findOne(id);
      if (!eventToUpdate) {
        throw new NotFoundException(`Event with ID: ${id} not found.`);
      }

      // Update event information
      const updatedEvent = await this.prisma.events.update({
        where: { id },
        data: { accept_subscriptions: !eventToUpdate.accept_subscriptions },
      });

      return updatedEvent;
    } catch (error) {
      throw new BadRequestException('Error updating event: ' + error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
