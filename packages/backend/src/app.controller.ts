import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DatabaseStatus } from './database/types';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Returns welcome message',
  })
  @Get('db-check')
  @ApiOperation({ summary: 'Check database connection status' })
  @ApiResponse({
    status: 200,
    description: 'Database connection status',
  })
  @ApiResponse({
    status: 503,
    description: 'Database connection failed',
  })
  async checkDatabase(): Promise<DatabaseStatus> {
    return this.appService.checkDbConnection();
  }
}
