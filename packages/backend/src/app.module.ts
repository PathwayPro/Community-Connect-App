import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClerkAuthModule } from './clerk_auth/clerk_auth.module';

@Module({
  imports: [ClerkAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   // Implement NestModule interface to use middleware

//   // Apply the Clerk authentication middleware globally or to specific routes
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(ClerkAuthMiddleware) // Apply your custom Clerk middleware here
//       .forRoutes('*'); // Use '*' to apply it globally to all routes or specify specific routes
//   }
// }
