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
import { FilesService } from 'src/files/files.service';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';
import { EventsCategory } from 'src/events_categories/entities/events_category.entity';
import { UploadedFile } from 'src/files/util/uploaded-file.interface';
import { JwtPayload } from 'src/auth/types';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private categories: EventsCategoriesService,
    private filesService: FilesService,
  ) {}

  getFormattedFilters(filters: FilterEventDto): Prisma.EventsWhereInput {
    const formattedFilters: Prisma.EventsWhereInput = {};

    if (filters?.title) {
      formattedFilters.title = { contains: filters.title, mode: 'insensitive' };
    }
    if (filters?.description) {
      formattedFilters.description = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }
    if (filters?.location) {
      formattedFilters.location = {
        contains: filters.location,
        mode: 'insensitive',
      };
    }
    if (filters?.category_id) {
      formattedFilters.category_id = filters.category_id;
    }
    if (typeof filters?.is_free === 'boolean') {
      formattedFilters.is_free = filters.is_free;
    }
    // TYPE ONLY FOR ADMINS (MENTORS-MAnAGERS AND INVITATIONS WILL BE FETCHED SOMEWHERE ELSE)
    if (filters?.type) {
      formattedFilters.type = filters.type;
    }
    if (typeof filters?.requires_confirmation === 'boolean') {
      formattedFilters.requires_confirmation = filters.requires_confirmation;
    }
    if (typeof filters?.accept_subscriptions === 'boolean') {
      formattedFilters.accept_subscriptions = filters.accept_subscriptions;
    }

    // IF IS SET `start_date` filters only events for that specific date.
    // IF NOT `start_date` can filter for a date range with `date_from` and `date_to`
    if (filters?.start_date) {
      const date_from = new Date(filters.start_date);
      const date_to = new Date(date_from);
      date_to.setUTCHours(23, 59, 59, 999);
      formattedFilters.start_date = { gte: date_from, lte: date_to };
    } else {
      if (filters?.date_from && filters?.date_to) {
        formattedFilters.start_date = {
          gte: filters.date_from,
          lte: filters.date_to,
        };
      } else if (filters?.date_from) {
        formattedFilters.start_date = { gte: filters.date_from };
      } else if (filters?.date_to) {
        formattedFilters.start_date = { lte: filters.date_to };
      }
    }

    return formattedFilters;
  }

  async validateEventCategory(category_id: number): Promise<EventsCategory> {
    try {
      const category = await this.categories.findOne(category_id);
      if (!category) {
        throw new BadRequestException(
          `The category with ID #${category_id} was not found.`,
        );
      }
      return category;
    } catch (error) {
      throw new BadRequestException(
        'Error validating event_category: ' + error.message,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadedFile> {
    try {
      // UPLOAD IMAGE TO GET THE LINK
      const imageLink = await this.filesService.upload(
        FileValidationEnum.EVENTS,
        file,
      );
      if (!imageLink) {
        throw new InternalServerErrorException(
          'There was a problem uploading the image. Please try again later',
        );
      }
      return imageLink;
    } catch (error) {
      throw new BadRequestException(
        'Error uploading the image for this event: ' + error.message,
      );
    }
  }

  async create(
    user: JwtPayload,
    createEventDto: CreateEventDto,
    file: Express.Multer.File | null,
  ) {
    try {
      // VALIDATE CATEGORY
      const category = await this.validateEventCategory(
        createEventDto.category_id,
      );

      // UPLOAD IMAGE AND GET THE LINK OR NULL
      const image = file ? await this.uploadImage(file) : null;

      // CREATE EVENT
      const eventData = {
        ...createEventDto,
        image: image ? image.path + '/' + image.fileName : null,
        category_id: category.id,
      };
      const event = await this.prisma.events.create({
        data: eventData,
      });

      /* * * * * * * * * * * * * * * * * * */
      /* * * * * * * * TO-DO * * * * * * * */
      /* * * * * * * * * * * * * * * * * * */
      // AGREGAR MANAGERS (USER ID)

      return event;
    } catch (error) {
      throw new BadRequestException('Error creating event: ' + error.message);
    }
  }

  async findAll(filters: FilterEventDto) {
    try {
      const appliedFilters: Prisma.EventsWhereInput =
        this.getFormattedFilters(filters);

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

  async update(
    event_id: number,
    user: JwtPayload,
    updateEventDto: UpdateEventDto,
    file: Express.Multer.File | null,
  ) {
    try {
      // VALIDATE EVENT EXIST OR THROW EXCEPTION
      const eventToUpdate = await this.findOne(event_id);
      if (!eventToUpdate) {
        throw new NotFoundException(`Event with ID: ${event_id} not found.`);
      }

      // VALIDATE CATGORY OR LEAVE IT NULL
      const category = updateEventDto.category_id
        ? await this.validateEventCategory(updateEventDto.category_id)
        : null;

      // UPLOAD IMAGE AND GET THE LINK OR NULL
      const image = file ? await this.uploadImage(file) : null;

      // UPDATE EVENT INFORMATION
      const eventData = {
        ...updateEventDto,
        image: image ? image.path + '/' + image.fileName : undefined,
        category_id: category ? category.id : undefined,
      };

      const updatedEvent = await this.prisma.events.update({
        where: { id: event_id },
        data: eventData,
      });

      return updatedEvent;
    } catch (error) {
      throw new BadRequestException('Error updating event: ' + error.message);
    }
  }

  async toggleSubscription(id: number) {
    try {
      // VALIDATE EVENT EXIST OR THROW EXCEPTION
      const eventToUpdate = await this.findOne(id);
      if (!eventToUpdate) {
        throw new NotFoundException(`Event with ID: ${id} not found.`);
      }

      // UPDATE SUBSCRIPTION: TOGGLE STATUS true => false | false => true
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
