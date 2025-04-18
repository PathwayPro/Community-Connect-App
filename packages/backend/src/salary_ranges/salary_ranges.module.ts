import { Module } from '@nestjs/common';
import { SalaryRangesService } from './salary_ranges.service';
import { SalaryRangesController } from './salary_ranges.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [SalaryRangesController],
  providers: [SalaryRangesService, PrismaService],
})
export class SalaryRangesModule {}
