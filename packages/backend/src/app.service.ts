import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { DatabaseException } from './database/exceptions/database.exception';
import { DatabaseStatus } from './database/types';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDbConnection(): Promise<DatabaseStatus> {
    const connection = await this.prisma.checkConnection();

    if (connection.isConnected) {
      return {
        status: 'connected',
        message: 'Database connection successful',
      };
    }

    throw new DatabaseException(
      connection.error || 'Failed to connect to database',
    );
  }
}
