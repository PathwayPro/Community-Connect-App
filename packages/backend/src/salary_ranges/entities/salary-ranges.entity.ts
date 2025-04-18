import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SalaryRanges {
  @ApiProperty({ description: 'Unique identifier for the salary range' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Starting salary amount' })
  @IsInt()
  from: number;

  @ApiProperty({ description: 'Maximum salary amount' })
  @IsInt()
  to: number;
}
