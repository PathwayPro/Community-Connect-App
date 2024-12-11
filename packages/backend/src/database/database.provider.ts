import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'PG_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<Client> => {
      const client = new Client({
        user: configService.get<string>('DB_USERNAME'),
        host: configService.get<string>('DB_HOST'),
        database: configService.get<string>('DB_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
      });

      await client.connect(); // Connect to the database
      console.log('Database connected successfully!');
      return client;
    },
    inject: [ConfigService], // Use ConfigService for environment variables
  },
];
