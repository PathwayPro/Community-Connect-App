import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventsManagerDto } from './dto/create-events_manager.dto';
import { UpdateEventsManagerDto } from './dto/update-events_manager.dto';
import { DeleteEventsManagerDto } from './dto/delete-events_manager.dto';
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
    const user = await this.prisma.users.findFirst({ where: { id: user_id } });
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
    });
    if (!event) {
      throw new NotFoundException(`There is no event with ID: ${event_id}.`);
    }

    // VALIDATION: MANAGER ALREADY EXIST
    const isManager = await this.prisma.eventsManagers.findFirst({
      where: { user_id: user_id, event_id: event_id },
    });
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

  async create(createEventsManagerDto: CreateEventsManagerDto) {
    try {
      // VALIDATE EXISTENCES AND GET DATA
      const managerData = await this.validateExistences(
        createEventsManagerDto.user_id,
        createEventsManagerDto.event_id,
        true,
      );

      const newManagerData: CreateEventsManagerDto = {
        user_id: createEventsManagerDto.user_id,
        event_id: createEventsManagerDto.event_id,
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

  async findAll(filters: FilterEventsManagerDto) {
    const appliedFilters: Prisma.EventsManagersWhereInput =
      this.getFormattedFilters(filters);

    try {
      const managers = await this.prisma.eventsManagers.findMany({
        where: appliedFilters,
        include: {
          user: true,
          event: true,
        },
      });
      return managers;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateIsSpeaker(
    logged_user: JwtPayload,
    updateEventsManagerDto: UpdateEventsManagerDto,
  ) {
    try {
      // VALIDATE USER HAS MANAGEMENT PERMISSIONS: ADMIN || MENTOR AS MANAGER
      const canEdit =
        logged_user.roles === 'ADMIN' ||
        (await this.isEventManager(
          logged_user.sub,
          updateEventsManagerDto.event_id,
        ));
      if (!canEdit) {
        throw new BadRequestException(
          `You are not allowed to manage this event.`,
        );
      }

      // VALIDATE USER, EVENT, IS_MANAGER
      const currentManager = await this.validateExistences(
        updateEventsManagerDto.user_id,
        updateEventsManagerDto.event_id,
        false,
      );
      if (!currentManager.isManager) {
        throw new BadRequestException(
          `The user is not a manager for this event. You can register them as managers or add an external speaker.`,
        );
      }

      // IF IS MANAGER, UPDATE CURRENT SPEKAER STATUS
      const updatedIsSpeaker = await this.prisma.eventsManagers.update({
        where: { id: currentManager.isManager.id },
        data: { is_speaker: !currentManager.isManager.is_speaker },
      });

      if (!updatedIsSpeaker) {
        throw new InternalServerErrorException(
          'There was an error updating the speaker status for this manager. Please, try again later.',
        );
      }

      return {
        updatedIsSpeaker,
        user: currentManager.user,
        event: currentManager.event,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(removeManager: DeleteEventsManagerDto) {
    try {
      const deletedManager = await this.prisma.eventsManagers.deleteMany({
        where: {
          user_id: removeManager.user_id,
          event_id: removeManager.event_id,
        },
      });
      return deletedManager;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
