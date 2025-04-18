import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateSalaryRangeDto {
  @ApiProperty({ example: 30000, description: 'Starting salary amount' })
  @IsInt()
  @Min(0)
  from: number;

  @ApiProperty({ example: 50000, description: 'Maximum salary amount' })
  @IsInt()
  @Min(0)
  to: number;
}
