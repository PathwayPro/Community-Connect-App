import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { DeleteEventsSubscriptionDto } from './dto/delete-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  getFormattedFilters(
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

    return formattedFilters;
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
        `There is no user user with ID: ${createEventsSubscriptionDto.user_id}.`,
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
      throw new BadRequestException(
        `There is already a subscription 
          from ${user.first_name} ${user.last_name} 
          for the event ${event.title}
          created on ${subscription.created_at}
          with status ${subscription.status}
          `,
      );
    }

    return { user, event, subscription };
  }

  async create(createEventsSubscriptionDto: CreateEventsSubscriptionDto) {
    try {
      // VALIDATE EXISTENCES AND GET DATA
      const subscriptionData = await this.validateSubscription(
        createEventsSubscriptionDto,
      );

      const newSubscription = await this.prisma.eventsSubscriptions.create({
        data: createEventsSubscriptionDto,
      });

      return { newSubscription, ...subscriptionData };
    } catch (error) {
      throw new BadRequestException(
        'Error creating subscription: ' + error.message,
      );
    }
  }

  async findAll(filters: FilterEventsSubscriptionDto) {
    const appliedFilters: Prisma.EventsSubscriptionsWhereInput =
      this.getFormattedFilters(filters);
    console.log('APPLIED FILTERS:', appliedFilters);

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

  async remove(deleteEventsSubscriptionDto: DeleteEventsSubscriptionDto) {
    try {
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
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
  ) {
    try {
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
