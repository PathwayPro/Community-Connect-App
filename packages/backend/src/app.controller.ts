import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkGuard } from './clerk.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(ClerkGuard)
  @Get()
  getProfile() {
    return { message: 'You have access to this protected route!' };
  }
}
