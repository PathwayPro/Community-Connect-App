import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventsInvitationDto } from './dto/create-events_invitation.dto';
import { FilterEventsInvitationDto } from './dto/filter-events_invitation.dto';
import { DeleteEventsInvitationDto } from './dto/delete-events_invitation.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { EventsManagersService } from '../events_managers/events_managers.service';

@Injectable()
export class EventsInvitationsService {
  constructor(
    private prisma: PrismaService,
    private readonly managers: EventsManagersService,
  ) {}

  getFormattedFilters(
    user: JwtPayload,
    filters: FilterEventsInvitationDto,
  ): Prisma.EventsInvitationsWhereInput {
    const formattedFilters: Prisma.EventsInvitationsWhereInput = {};

    if (filters?.inviter_id) {
      formattedFilters.inviter_id = filters.inviter_id;
    }
    // USERS CAN ONLY SEE WHEN THEY ARE INVITEES
    if (user.roles === 'USER') {
      formattedFilters.invitee_id = user.sub;
    } else if (filters?.invitee_id) {
      formattedFilters.invitee_id = filters.invitee_id;
    }

    // MENTORS CAN FILTER EVERYTHING, BUT ONLY GET RESULTS RELATED TO THEM
    if (user.roles === 'MENTOR') {
      formattedFilters.OR = [
        { inviter_id: user.sub },
        { invitee_id: user.sub },
      ];
    }

    // EVENT, DATE FROM, DATE TO ARE THE SAME FOR EVERY ROLE
    if (filters?.event_id) {
      formattedFilters.event_id = filters.event_id;
    }
    if (filters?.date_from) {
      formattedFilters.created_at = {
        gte: filters.date_from,
      };
    }
    if (filters?.date_to) {
      formattedFilters.created_at = {
        lte: filters.date_to,
      };
    }

    return formattedFilters;
  }

  async validateInvitation(
    createEventsInvitationDto: CreateEventsInvitationDto,
  ) {
    // VALIDATION: INVITER EXISTS
    const inviter = await this.prisma.users.findFirst({
      where: { id: createEventsInvitationDto.inviter_id },
    });
    if (!inviter) {
      throw new NotFoundException(
        `There is no inviter user with ID: ${createEventsInvitationDto.inviter_id}.`,
      );
    }

    // VALIDATION: INVITEE EXISTS
    const invitee = await this.prisma.users.findFirst({
      where: { id: createEventsInvitationDto.invitee_id },
    });
    if (!invitee) {
      throw new NotFoundException(
        `There is no invitee user with ID: ${createEventsInvitationDto.inviter_id}.`,
      );
    }

    // VALIDATION: EVENT EXISTS
    const event = await this.prisma.events.findFirst({
      where: { id: createEventsInvitationDto.event_id },
    });
    if (!event) {
      throw new NotFoundException(
        `There is no event with ID: ${createEventsInvitationDto.event_id}.`,
      );
    }

    // VALIDATION: INVITATION EXISTS
    const invitation = await this.prisma.eventsInvitations.findFirst({
      where: {
        inviter_id: createEventsInvitationDto.inviter_id,
        invitee_id: createEventsInvitationDto.invitee_id,
        event_id: createEventsInvitationDto.event_id,
      },
    });
    if (invitation) {
      throw new BadRequestException(
        `There is already an invitation 
        from ${inviter.first_name} ${inviter.last_name} 
        to ${invitee.first_name} ${invitee.last_name}
        for the event ${event.title}
        created on ${invitation.created_at}
        `,
      );
    }

    return { inviter, invitee, event };
  }

  async create(
    user: JwtPayload,
    createEventsInvitationDto: CreateEventsInvitationDto,
  ) {
    try {
      // MENTORS CAN ONLY INVITE FOR THEIR MANAGED EVENTS
      if (
        user.roles === 'MENTOR' &&
        !(await this.managers.isEventManager(
          user.sub,
          createEventsInvitationDto.event_id,
        ))
      ) {
        throw new UnauthorizedException(
          'You are not authorized to invite for this event.',
        );
      }

      // VALIDATE EXISTENCES AND GET DATA
      const invitationData = await this.validateInvitation(
        createEventsInvitationDto,
      );

      const newInvitation = await this.prisma.eventsInvitations.create({
        data: createEventsInvitationDto,
      });

      return { newInvitation, ...invitationData };
    } catch (error) {
      throw new BadRequestException(
        'Error creating invitation: ' + error.message,
      );
    }
  }

  async findAll(user: JwtPayload, filters: FilterEventsInvitationDto) {
    const appliedFilters: Prisma.EventsInvitationsWhereInput =
      this.getFormattedFilters(user, filters);

    try {
      const invitations = await this.prisma.eventsInvitations.findMany({
        where: appliedFilters,
        include: {
          invitee: true,
          inviter: true,
          event: true,
        },
      });
      return invitations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(
    user: JwtPayload,
    deleteEventsInvitationDto: DeleteEventsInvitationDto,
  ) {
    try {
      // USERS CAN ONLY DELETE THEIR INVITATIONS
      if (
        user.roles === 'USER' &&
        deleteEventsInvitationDto.invitee_id !== user.sub
      ) {
        throw new BadRequestException(
          'You are not authorized to delete this invitation.',
        );
      }

      // MENTORS CAN ONLY DELETE THEIR RELATED INVITATIONS
      if (
        user.roles === 'MENTOR' &&
        deleteEventsInvitationDto.invitee_id !== user.sub &&
        deleteEventsInvitationDto.inviter_id !== user.sub
      ) {
        throw new BadRequestException(
          'You are not authorized to delete this invitation.',
        );
      }

      const deletedInvitation = await this.prisma.eventsInvitations.deleteMany({
        where: {
          inviter_id: deleteEventsInvitationDto.inviter_id,
          invitee_id: deleteEventsInvitationDto.invitee_id,
          event_id: deleteEventsInvitationDto.event_id,
        },
      });
      return deletedInvitation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
