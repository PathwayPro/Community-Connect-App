import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventsInvitationDto } from './dto/create-events_invitation.dto';
import { FilterEventsInvitationDto } from './dto/filter-events_invitation.dto';
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
    if (filters?.date_from && filters?.date_to) {
      formattedFilters.created_at = {
        gte: filters.date_from,
        lte: filters.date_to,
      };
    } else if (filters?.date_from) {
      formattedFilters.created_at = { gte: filters.date_from };
    } else if (filters?.date_to) {
      formattedFilters.created_at = { lte: filters.date_to };
    }

    return formattedFilters;
  }

  async validateInvitation(
    user: JwtPayload,
    createEventsInvitationDto: CreateEventsInvitationDto,
  ) {
    // VALIDATION: INVITER EXISTS
    const inviter = await this.prisma.users.findFirst({
      where: { id: user.sub },
    });
    if (!inviter) {
      throw new NotFoundException(
        `There is no inviter user with ID: ${user.sub}.`,
      );
    }

    // VALIDATION: INVITEE EXISTS
    const invitee = await this.prisma.users.findFirst({
      where: { id: createEventsInvitationDto.invitee_id },
    });
    if (!invitee) {
      throw new NotFoundException(
        `There is no invitee user with ID: ${createEventsInvitationDto.invitee_id}.`,
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
        inviter_id: user.sub,
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

  async isEventInvitee(invitee_id: number, event_id: number): Promise<boolean> {
    try {
      const isInvitee = await this.prisma.eventsInvitations.findFirst({
        where: { invitee_id, event_id },
      });
      return isInvitee ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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
        user,
        createEventsInvitationDto,
      );
      if (!invitationData) {
        throw new InternalServerErrorException(
          'There was an error validating the invitation.',
        );
      }

      const newInvitationData: Prisma.EventsInvitationsCreateInput = {
        inviter: { connect: { id: user.sub } },
        invitee: { connect: { id: createEventsInvitationDto.invitee_id } },
        event: { connect: { id: createEventsInvitationDto.event_id } },
        message: createEventsInvitationDto.message || '',
      };

      const newInvitation = await this.prisma.eventsInvitations.create({
        data: newInvitationData,
      });

      return { newInvitation };
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
          invitee: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
            },
          },
          inviter: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
            },
          },
          event: {
            select: {
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
      return invitations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(user: JwtPayload, id: number) {
    try {
      //FIND INVITATION
      const invitationToDelete = await this.prisma.eventsInvitations.findFirst({
        where: { id },
      });
      if (!invitationToDelete) {
        throw new NotFoundException('Tere is no invitation with ID:' + id);
      }

      // USERS CAN ONLY DELETE THEIR INVITATIONS
      if (user.roles === 'USER' && invitationToDelete.invitee_id !== user.sub) {
        throw new BadRequestException(
          'You are not authorized to delete this invitation.',
        );
      }

      // MENTORS CAN ONLY DELETE THEIR RELATED INVITATIONS
      if (
        user.roles === 'MENTOR' &&
        invitationToDelete.invitee_id !== user.sub &&
        invitationToDelete.inviter_id !== user.sub
      ) {
        throw new BadRequestException(
          'You are not authorized to delete this invitation.',
        );
      }

      const deletedInvitation = await this.prisma.eventsInvitations.delete({
        where: { id },
      });

      return deletedInvitation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
