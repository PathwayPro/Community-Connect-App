import { Module } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { NetworkingController } from './networking.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [NetworkingController],
  providers: [PrismaService, NetworkingService],
})
export class NetworkingModule {}
