import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    // Check and fix sequence on startup
    await this.checkAndFixSequence();
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

  private async checkAndFixSequence() {
    try {
      // Get the current maximum ID from the users table
      const result = await this.$queryRaw`
        SELECT COALESCE(MAX(id), 0) as max_id FROM users;
      `;
      const maxId = Number(result[0]?.max_id || 0);

      // Reset the sequence to the max ID + 1
      await this.$queryRaw`
        SELECT setval('users_id_seq', ${maxId}, true);
      `;
    } catch (error) {
      console.error('Error checking/fixing sequence:', error);
    }
  }
}
