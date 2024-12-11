import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class AppService {
  constructor(@Inject('PG_CONNECTION') private readonly client: Client) {}

  async checkDbConnection(): Promise<string> {
    try {
      // Execute a lightweight query to check if the DB is active
      await this.client.query('SELECT 1');

      // Extract database name and port from the connection configuration
      const dbName = this.client.database || 'unknown database';
      const dbPort = this.client.port || 'unknown port';

      return `Database "${dbName}" running successfully on port "${dbPort}"`;
    } catch (error) {
      console.error('Error checking database connection:', error.message);
      throw new Error('Failed to connect to the database.');
    }
  }

  getHello(): string {
    return 'Welcome to the Home Page!';
  }
}
