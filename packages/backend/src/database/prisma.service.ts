import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async checkConnection() {
    try {
      await this.$queryRaw`SELECT 1`;
      const dbUrl = process.env.DATABASE_URL || 'postgresql://...';
      const dbName = dbUrl.split('/').pop()?.split('?')[0] || 'unknown';

      return {
        isConnected: true,
        dbName,
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error.message,
      };
    }
  }
}
