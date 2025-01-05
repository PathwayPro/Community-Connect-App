import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { DeleteEventsSubscriptionDto } from './dto/delete-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
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
    // DESCRIPTION:
    //    USER: Will only fetch their own subscriptions (user_id = user.sub)
    //    ADMIN: Can use any filter without limitations
    //    MENTOR: Can fetch their own subscriptions AND those in events they manage

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
    createEventsSubscriptionDto: CreateEventsSubscriptionDto,
    isNewSubscription: boolean = true,
  ) {
    // VALIDATION: USER EXISTS
    const user = await this.prisma.users.findFirst({
      where: { id: createEventsSubscriptionDto.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `There is no user with ID: ${createEventsSubscriptionDto.user_id}.`,
      );
    }

    // VALIDATION: EVENT EXISTS
    const event = await this.prisma.events.findFirst({
      where: { id: createEventsSubscriptionDto.event_id },
    });
    if (!event) {
      throw new NotFoundException(
        `There is no event with ID: ${createEventsSubscriptionDto.event_id}.`,
      );
    }

    // VALIDATION: SUBSCRIPTION EXISTS
    const subscription = await this.prisma.eventsSubscriptions.findFirst({
      where: {
        user_id: createEventsSubscriptionDto.user_id,
        event_id: createEventsSubscriptionDto.event_id,
      },
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
    event_type: 'PUBLIC' | 'PRIVATE',
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

  async create(createEventsSubscriptionDto: CreateEventsSubscriptionDto) {
    try {
      // VALIDATE EXISTENCES AND GET DATA
      const subscriptionData = await this.validateSubscription(
        createEventsSubscriptionDto,
      );

      // VALIDATE IF THE USER CAN SUBSCRIBE TO THAT EVENT
      const canSubscribe = await this.canSubscribe(
        createEventsSubscriptionDto.user_id,
        subscriptionData.event.id,
        subscriptionData.event.type,
        subscriptionData.event.accept_subscriptions,
      );
      if (!canSubscribe) {
        throw new BadRequestException("You can't subscribe to this event");
      }

      const newSubscriptionData: CreateEventsSubscriptionDto = {
        user_id: createEventsSubscriptionDto.user_id,
        event_id: createEventsSubscriptionDto.event_id,
        status: subscriptionData.event.requires_confirmation
          ? 'PENDING'
          : 'APPROVED',
      };

      const newSubscription = await this.prisma.eventsSubscriptions.create({
        data: newSubscriptionData,
      });

      return { newSubscription, ...subscriptionData };
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
          user: true,
          event: true,
          updates: true,
        },
      });

      return subscriptions;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(
    user: JwtPayload,
    deleteEventsSubscriptionDto: DeleteEventsSubscriptionDto,
  ) {
    try {
      const canDelete =
        // ANYONE CAN DELETE THEIR OWN SUBSCRIPTIONS (USER, MENTOR, ADMIN)
        user.sub === deleteEventsSubscriptionDto.user_id
          ? true
          : // ADMIN CAN DELETE ANY SUBSCRIPTION
            user.roles === 'ADMIN'
            ? true
            : // MENTOR CAN DELETE THEIR OWN SUBSCRIPTIONS AND THOSE IN EVENTS THEY MANAGE
              user.roles === 'MENTOR' &&
                (await this.managers.isEventManager(
                  user.sub,
                  deleteEventsSubscriptionDto.event_id,
                ))
              ? true
              : // OTHERWISE IS NOT AUTHORIZED TO DELETE
                false;

      if (!canDelete) {
        throw new UnauthorizedException(
          'You are not authorized to delete this subscription.',
        );
      }

      const deletedSubscription =
        await this.prisma.eventsSubscriptions.deleteMany({
          where: {
            user_id: deleteEventsSubscriptionDto.user_id,
            event_id: deleteEventsSubscriptionDto.event_id,
          },
        });
      return deletedSubscription;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStatus(
    user: JwtPayload,
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
  ) {
    // TO-DO: MENTORS CAN ONLY UPDATE STATUS OF THEIR MANAGED EVENTS, NOT ON THEIR APPLICATIONS (isEventManager)

    try {
      const canUpdateStatus =
        // ADMIN CAN UPDATE ANY SUBSCRIPTION STATUS
        user.roles === 'ADMIN'
          ? true
          : // MENTOR CAN UPDATE SUBSCRIPTIONS STATUS IN EVENTS THEY MANAGE
            user.roles === 'MENTOR' &&
              (await this.managers.isEventManager(
                user.sub,
                updateEventsSubscriptionStatusDto.event_id,
              ))
            ? true
            : // OTHERWISE IS NOT AUTHORIZED TO UPDATE SUBSCRIPTION STATUS
              false;

      if (!canUpdateStatus) {
        throw new UnauthorizedException(
          'You are not authorized to update this subscription status.',
        );
      }

      // VALIDATE SUBSCRIPTION, USER AND EVENT
      const currentSubscription = await this.validateSubscription(
        updateEventsSubscriptionStatusDto,
        false,
      );
      if (!currentSubscription) {
        throw new BadRequestException(
          `There is no subscription from ${currentSubscription.user.first_name} ${currentSubscription.user.last_name} for the event ${currentSubscription.event.title}`,
        );
      }

      // IF SUBSCRIPTION EXISTS, UPDATE CURRENT STATUS
      const updatedSubscription = await this.prisma.eventsSubscriptions.update({
        where: { id: currentSubscription.subscription.id },
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
            subscription_id: currentSubscription.subscription.id,
            prev_status: currentSubscription.subscription.status,
            new_status: updateEventsSubscriptionStatusDto.new_status,
            message: updateEventsSubscriptionStatusDto.message,
            updated_by: updateEventsSubscriptionStatusDto.updated_by,
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
          where: { id: currentSubscription.subscription.id },
          include: {
            event: true,
            user: true,
            updates: {
              include: {
                updater: true,
              },
            },
          },
        });

      if (!fullyUpdatedSubscription) {
        throw new InternalServerErrorException(
          'There was an error fetching the updated subscription. Please, try again later or try to fetch this subscription by user and event.',
        );
      }

      return fullyUpdatedSubscription;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
