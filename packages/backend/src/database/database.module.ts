import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.provider';

@Module({
  imports: [ConfigModule.forRoot()], // Load .env configuration
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
