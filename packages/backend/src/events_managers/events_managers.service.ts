import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventsManagerDto } from './dto/create-events_manager.dto';
import { FilterEventsManagerDto } from './dto/filter-events_manager.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@Injectable()
export class EventsManagersService {
  constructor(private prisma: PrismaService) {}

  getFormattedFilters(
    filters: FilterEventsManagerDto,
  ): Prisma.EventsManagersWhereInput {
    const formattedFilters: Prisma.EventsManagersWhereInput = {};

    if (filters?.user_id) {
      formattedFilters.user_id = filters.user_id;
    }
    if (filters?.event_id) {
      formattedFilters.event_id = filters.event_id;
    }
    if (typeof filters?.is_speaker === 'boolean') {
      formattedFilters.is_speaker = filters.is_speaker;
    }

    return formattedFilters;
  }

  async validateExistences(
    user_id: number,
    event_id: number,
    validateManagerExist: boolean = false,
  ) {
    // VALIDATION: USER EXISTS && IS ADMIN OR MENTOR
    const user = await this.prisma.users.findFirst({
      where: { id: user_id },
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`There is no user with ID: ${user_id}.`);
    }
    if (user.role !== 'ADMIN' && user.role !== 'MENTOR') {
      throw new BadRequestException(
        `This user doesn't have permission to be an event manager. User ID: ${user_id}.`,
      );
    }

    // VALIDATION: EVENT EXISTS
    const event = await this.prisma.events.findFirst({
      where: { id: event_id },
      select: {
        id: true,
        title: true,
        location: true,
        link: true,
        image: true,
        is_free: true,
        start_date: true,
        end_date: true,
      },
    });
    if (!event) {
      throw new NotFoundException(`There is no event with ID: ${event_id}.`);
    }

    // VALIDATION: MANAGER ALREADY EXIST
    const isManager: boolean = await this.isEventManager(user_id, event_id);
    if (isManager && validateManagerExist) {
      throw new BadRequestException(
        `The user ${user.first_name} ${user.last_name} is already a manager for the event ${event.title}`,
      );
    }

    return { user, event, isManager };
  }

  async isEventManager(user_id: number, event_id: number): Promise<boolean> {
    try {
      const isManager = await this.prisma.eventsManagers.findFirst({
        where: { user_id: user_id, event_id: event_id },
      });
      return isManager ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(
    user: JwtPayload,
    createEventsManagerDto: CreateEventsManagerDto,
    managerFromNewEvent: boolean = true,
  ) {
    try {
      let canCreate: boolean = user.roles === 'ADMIN'; // ADMIN ALWAYS CAN ADD MANAGERS TO EVENTS
      if (!canCreate) {
        // IF THE USER IS A MENTOR, THEY HAVE TO BE CREATING THE EVENT OR BE ALREADY MANAGERS
        if (user.roles === 'MENTOR') {
          if (
            (managerFromNewEvent &&
              user.sub === createEventsManagerDto.user_id) ||
            (await this.isEventManager(
              user.sub,
              createEventsManagerDto.event_id,
            ))
          ) {
            canCreate = true;
          }
        }
      }

      if (!canCreate) {
        throw new UnauthorizedException(
          'You are not authorized to add managers to this event.',
        );
      }

      // VALIDATE EXISTENCES AND GET DATA
      const managerData = await this.validateExistences(
        createEventsManagerDto.user_id,
        createEventsManagerDto.event_id,
        true,
      );

      const newManagerData: Prisma.EventsManagersCreateInput = {
        user: { connect: { id: createEventsManagerDto.user_id } },
        event: { connect: { id: createEventsManagerDto.event_id } },
        is_speaker: createEventsManagerDto.is_speaker
          ? createEventsManagerDto.is_speaker
          : false,
      };

      const newManager = await this.prisma.eventsManagers.create({
        data: newManagerData,
      });

      return { newManager, user: managerData.user, event: managerData.event };
    } catch (error) {
      throw new BadRequestException(
        'Error creating a new event manager: ' + error.message,
      );
    }
  }

  async findAll(user: JwtPayload, filters: FilterEventsManagerDto) {
    const appliedFilters: Prisma.EventsManagersWhereInput =
      this.getFormattedFilters(filters);

    try {
      const managers = await this.prisma.eventsManagers.findMany({
        where: appliedFilters,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              location: true,
              link: true,
              image: true,
              is_free: true,
              start_date: true,
              end_date: true,
            },
          },
        },
      });
      return managers;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleIsSpeaker(user: JwtPayload, id: number) {
    try {
      // VALIDATE USER HAS MANAGEMENT PERMISSIONS: ADMIN || MENTOR AS MANAGER
      const canEdit =
        user.roles === 'ADMIN' || (await this.isEventManager(user.sub, id));
      if (!canEdit) {
        throw new BadRequestException(
          `You are not allowed to manage this event.`,
        );
      }

      // VALIDATE MANAGER EXISTS
      const currentManager = await this.prisma.eventsManagers.findFirst({
        select: { is_speaker: true },
        where: { id },
      });

      // IF IS MANAGER, UPDATE CURRENT SPEKAER STATUS
      const updatedIsSpeaker = await this.prisma.eventsManagers.update({
        where: { id },
        data: { is_speaker: !currentManager.is_speaker },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              location: true,
              link: true,
              image: true,
              is_free: true,
              start_date: true,
              end_date: true,
            },
          },
        },
      });

      if (!updatedIsSpeaker) {
        throw new InternalServerErrorException(
          'There was an error updating the speaker status for this manager. Please, try again later.',
        );
      }

      return { updatedIsSpeaker };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(user: JwtPayload, id: number) {
    try {
      // VALIDATE USER HAS MANAGEMENT PERMISSIONS: ADMIN || MENTOR AS MANAGER
      const canDelete =
        user.roles === 'ADMIN' || (await this.isEventManager(user.sub, id));
      if (!canDelete) {
        throw new BadRequestException(
          `You are not allowed to manage this event.`,
        );
      }
      const deletedManager = await this.prisma.eventsManagers.delete({
        where: { id },
      });
      return deletedManager;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
