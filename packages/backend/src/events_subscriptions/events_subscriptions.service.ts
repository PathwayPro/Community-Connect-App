import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { PrismaService } from 'src/database';
import { EventsTypes, Prisma } from '@prisma/client';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { EventsManagersService } from '../events_managers/events_managers.service';

@Injectable()
export class EventsSubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private readonly managers: EventsManagersService,
  ) {}

  getFormattedFilters(
    user: JwtPayload,
    filters: FilterEventsSubscriptionDto,
  ): Prisma.EventsSubscriptionsWhereInput {
    const formattedFilters: Prisma.EventsSubscriptionsWhereInput = {};

    if (filters?.user_id) {
      formattedFilters.user_id = filters.user_id;
    }
    if (filters?.event_id) {
      formattedFilters.event_id = filters.event_id;
    }
    if (filters?.status) {
      formattedFilters.status = filters.status;
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

    const mentorFormattedFilters: Prisma.EventsSubscriptionsWhereInput =
      user.roles !== 'MENTOR'
        ? {}
        : {
            OR: [
              { event: { managers: { some: { user_id: user.sub } } } },
              { user_id: user.sub },
            ],
          };

    return { AND: [formattedFilters, mentorFormattedFilters] };
  }

  async validateSubscription(
    user_id: number,
    event_id: number,
    isNewSubscription: boolean = true,
  ) {
    // VALIDATION: USER EXISTS
    const user = await this.prisma.users.findFirst({
      where: { id: user_id },
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`There is no user with ID: ${user_id}.`);
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
        type: true,
        start_date: true,
        end_date: true,
        requires_confirmation: true,
        is_free: true,
        category: true,
        accept_subscriptions: true,
      },
    });
    if (!event) {
      throw new NotFoundException(`There is no event with ID: ${event_id}.`);
    }

    // VALIDATION: SUBSCRIPTION EXISTS
    const subscription = await this.prisma.eventsSubscriptions.findFirst({
      where: { user_id: user_id, event_id: event_id },
    });
    if (subscription && isNewSubscription) {
      throw new BadRequestException(`
          There is already a subscription 
          from ${user.first_name} ${user.last_name} 
          for the event ${event.title}
          created on ${subscription.created_at}
          with status ${subscription.status}
        `);
    }

    return { user, event, subscription };
  }

  async canSubscribe(
    user_id: number,
    event_id: number,
    event_type: EventsTypes,
    accept_subscriptions: boolean,
  ) {
    // THE EVENT HAS TO BE ACCEPTING NEW SUBSCRIPTIONS
    if (!accept_subscriptions) {
      throw new BadRequestException(
        'This event is not taking new subscriptions any more.',
      );
    }

    // IF THE EVENT IS PRIVATE THE SUBSCRIBER MUST BE INVITED
    if (event_type === 'PRIVATE') {
      const invitation = await this.prisma.eventsInvitations.findFirst({
        where: { event_id, invitee_id: user_id },
      });
      if (!invitation) {
        throw new BadRequestException(
          'You can only subscribe to this event with an invitation.',
        );
      }
    }

    return true;
  }

  async create(
    createEventsSubscriptionDto: CreateEventsSubscriptionDto,
    user: JwtPayload,
  ) {
    try {
      // VALIDATE EXISTENCES AND GET DATA
      const subscriptionData = await this.validateSubscription(
        user.sub,
        createEventsSubscriptionDto.event_id,
        true,
      );

      // VALIDATE IF THE USER CAN SUBSCRIBE TO THAT EVENT
      const canSubscribe = await this.canSubscribe(
        user.sub,
        subscriptionData.event.id,
        subscriptionData.event.type,
        subscriptionData.event.accept_subscriptions,
      );
      if (!canSubscribe) {
        throw new BadRequestException("You can't subscribe to this event");
      }

      const newSubscriptionData: Prisma.EventsSubscriptionsCreateInput = {
        event: { connect: { id: createEventsSubscriptionDto.event_id } },
        user: { connect: { id: user.sub } },
        status: subscriptionData.event.requires_confirmation
          ? 'PENDING'
          : 'APPROVED',
      };

      const newSubscription = await this.prisma.eventsSubscriptions.create({
        data: newSubscriptionData,
        select: {
          id: true,
          status: true,
          created_at: true,
        },
      });

      return {
        newSubscription,
        details: { user: subscriptionData.user, event: subscriptionData.event },
      };
    } catch (error) {
      throw new BadRequestException(
        'Error creating subscription: ' + error.message,
      );
    }
  }

  async findAll(user: JwtPayload, filters: FilterEventsSubscriptionDto) {
    const appliedFilters: Prisma.EventsSubscriptionsWhereInput =
      this.getFormattedFilters(user, filters);

    try {
      const subscriptions = await this.prisma.eventsSubscriptions.findMany({
        where: appliedFilters,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              location: true,
              link: true,
              image: true,
              type: true,
              start_date: true,
              end_date: true,
              requires_confirmation: true,
              is_free: true,
              category: true,
              accept_subscriptions: true,
            },
          },
          updates: true,
        },
      });

      return subscriptions;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(user: JwtPayload, id: number) {
    try {
      // VALIDATE SUBSCRIPTION
      const subscriptionToDelete =
        await this.prisma.eventsSubscriptions.findFirst({ where: { id } });
      if (!subscriptionToDelete) {
        throw new NotFoundException('Tere is no subscription with ID:' + id);
      }

      const canDelete =
        // ANYONE CAN DELETE THEIR OWN SUBSCRIPTIONS (USER, MENTOR, ADMIN)
        user.sub === subscriptionToDelete.user_id
          ? true
          : // ADMIN CAN DELETE ANY SUBSCRIPTION
            user.roles === 'ADMIN'
            ? true
            : // MENTOR CAN DELETE THEIR OWN SUBSCRIPTIONS AND THOSE IN EVENTS THEY MANAGE
              user.roles === 'MENTOR' &&
                (await this.managers.isEventManager(
                  user.sub,
                  subscriptionToDelete.event_id,
                ))
              ? true
              : // OTHERWISE IS NOT AUTHORIZED TO DELETE
                false;

      if (!canDelete) {
        throw new UnauthorizedException(
          'You are not authorized to delete this subscription.',
        );
      }

      // DELETE SUBSCRIPTION
      const deletedSubscription = await this.prisma.eventsSubscriptions.delete({
        where: { id },
      });

      return deletedSubscription;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStatus(
    user: JwtPayload,
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
    subscription_id: number,
  ) {
    try {
      // VALIDATE SUBSCRIPTION EXISTS
      const subscriptionToUpdate =
        await this.prisma.eventsSubscriptions.findFirst({
          where: { id: subscription_id },
        });
      if (!subscriptionToUpdate) {
        throw new BadRequestException(
          'There is no subscription with ID ' + subscription_id,
        );
      }

      const canUpdateStatus =
        // ADMIN CAN UPDATE ANY SUBSCRIPTION STATUS
        user.roles === 'ADMIN'
          ? true
          : // MENTOR CAN UPDATE SUBSCRIPTIONS STATUS IN EVENTS THEY MANAGE
            user.roles === 'MENTOR' &&
              (await this.managers.isEventManager(
                user.sub,
                subscriptionToUpdate.event_id,
              ))
            ? true
            : // OTHERWISE IS NOT AUTHORIZED TO UPDATE SUBSCRIPTION STATUS
              false;

      if (!canUpdateStatus) {
        throw new UnauthorizedException(
          'You are not authorized to update this subscription status.',
        );
      }

      // IF SUBSCRIPTION EXISTS, UPDATE CURRENT STATUS
      const updatedSubscription = await this.prisma.eventsSubscriptions.update({
        where: { id: subscription_id },
        data: {
          status: updateEventsSubscriptionStatusDto.new_status,
          updated_at: new Date(),
        },
      });

      if (!updatedSubscription) {
        throw new InternalServerErrorException(
          'There was an error updating the status for this subscription. Please, try again later.',
        );
      }

      // IF STATUS UPDATED, INSERT STATUS LOG WITH MESSAGE
      const logStatusChange =
        await this.prisma.eventsSubscriptionsUpdates.create({
          data: {
            subscription_id: subscription_id,
            prev_status: subscriptionToUpdate.status,
            new_status: updateEventsSubscriptionStatusDto.new_status,
            message: updateEventsSubscriptionStatusDto.message,
            updated_by: user.sub,
          },
        });

      if (!logStatusChange) {
        throw new InternalServerErrorException(
          'There was an error logging the status change for this subscription. Please, try again later.',
        );
      }

      // RETURN SUBSCRIPTION WITH FULL INFORMATION
      const fullyUpdatedSubscription =
        await this.prisma.eventsSubscriptions.findFirst({
          where: { id: subscription_id },
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                middle_name: true,
                last_name: true,
              },
            },
            event: {
              select: {
                id: true,
                title: true,
                location: true,
                link: true,
                image: true,
                type: true,
                start_date: true,
                end_date: true,
                requires_confirmation: true,
                is_free: true,
                category: true,
                accept_subscriptions: true,
              },
            },
            updates: true,
          },
        });

      if (!fullyUpdatedSubscription) {
        throw new InternalServerErrorException(
          'There was an error fetching the updated subscription. Please, try again later',
        );
      }

      return fullyUpdatedSubscription;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
