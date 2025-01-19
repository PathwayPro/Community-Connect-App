import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './database';
import { MentorModule } from './mentor/mentor.module';
import { EmailService } from './auth/services/email.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventsCategoriesModule } from './events_categories/events_categories.module';
import { EventsSubscriptionsModule } from './events_subscriptions/events_subscriptions.module';
import { EventsInvitationsModule } from './events_invitations/events_invitations.module';
import { EventsManagersModule } from './events_managers/events_managers.module';
import { NewsModule } from './news/news.module';
import { ResourcesModule } from './resources/resources.module';
import { FilesModule } from './files/files.module';
import { GoalsModule } from './goals/goals.module';
import { InterestsModule } from './interests/interests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    MentorModule,
    EventsModule,
    EventsCategoriesModule,
    EventsSubscriptionsModule,
    EventsInvitationsModule,
    EventsManagersModule,
    NewsModule,
    ResourcesModule,
    FilesModule,
    GoalsModule,
    InterestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
