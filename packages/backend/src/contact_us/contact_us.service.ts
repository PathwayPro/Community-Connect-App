import { Injectable, Logger } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { ContactUs } from './entities/contact_us.entity';
import { PrismaService } from 'src/database/prisma.service';
import { ContactUsStatus, NewsletterStatus } from '@prisma/client';
import { EmailService } from 'src/auth/services/email.service';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class ContactUsService {
  private readonly logger = new Logger(ContactUsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    try {
      const contactUs = await this.prisma.contactUs.create({
        data: {
          ...createContactUsDto,
          status: ContactUsStatus.PENDING,
        },
      });

      try {
        const response = await this.emailService.sendEmailToAdmin(
          contactUs.contact_message,
          contactUs.email,
          contactUs.first_name,
          contactUs.last_name,
          contactUs.phone,
          contactUs.company_name,
        );

        if (!response.success) {
          this.logger.error(`Failed to send email: ${response.message}`);

          await this.prisma.contactUs.update({
            where: { id: contactUs.id },
            data: {
              status: ContactUsStatus.FAILED,
            },
          });

          throw new Error(`Failed to send email: ${response.message}`);
        }

        const updatedContactUs = await this.prisma.contactUs.update({
          where: { id: contactUs.id },
          data: {
            status: ContactUsStatus.SENT,
          },
        });

        return updatedContactUs;
      } catch (emailError) {
        this.logger.error(`Email sending failed: ${emailError.message}`);

        return contactUs;
      }
    } catch (error) {
      this.logger.error(`Contact creation failed: ${error.message}`);
      throw new Error(`Failed to create contact request: ${error.message}`);
    }
  }

  async updateStatus(
    id: number,
    updateContactUsDto: UpdateContactUsDto,
  ): Promise<ContactUs> {
    return this.prisma.contactUs.update({
      where: { id },
      data: updateContactUsDto,
    });
  }

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<Subscription> {
    try {
      const existingSubscription =
        await this.prisma.newsletterSubscriptions.findFirst({
          where: { email: subscribeDto.email },
        });

      if (existingSubscription) {
        throw new Error('Email already subscribed');
      }

      return this.prisma.newsletterSubscriptions.create({
        data: {
          ...subscribeDto,
          status: NewsletterStatus.SUBSCRIBED,
        },
      });
    } catch (error) {
      this.logger.error(`Subscription failed: ${error.message}`);
      throw new Error(`Failed to subscribe: ${error.message}`);
    }
  }

  async unsubscribe(
    unsubscribeDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      const existingSubscription =
        await this.prisma.newsletterSubscriptions.findFirst({
          where: { email: unsubscribeDto.email },
        });

      if (!existingSubscription) {
        throw new Error('Email not subscribed');
      }

      return this.prisma.newsletterSubscriptions.update({
        where: { id: existingSubscription.id },
        data: { status: NewsletterStatus.UNSUBSCRIBED },
      });
    } catch (error) {
      this.logger.error(`Unsubscription failed: ${error.message}`);
      throw new Error(`Failed to unsubscribe: ${error.message}`);
    }
  }

  findAll(): Promise<ContactUs[]> {
    return this.prisma.contactUs.findMany();
  }

  findOne(id: number): Promise<ContactUs> {
    return this.prisma.contactUs.findUnique({
      where: { id },
    });
  }
}
