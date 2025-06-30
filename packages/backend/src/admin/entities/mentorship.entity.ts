import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AdminMentorshipDashboardTotals {
  @ApiProperty({
    description: 'Total confirmed mentors',
    type: Number,
    example: 1893,
  })
  @IsNumber()
  totalMentors: number;

  @ApiProperty({
    description: 'Total confirmed mentees',
    type: Number,
    example: 14,
  })
  @IsNumber()
  totalMentees: number;

  @ApiProperty({
    description: 'Total mentor applications from last month',
    type: Number,
    example: 14,
  })
  @IsNumber()
  mentorApplicationsLastMonth: number;

  @ApiProperty({
    description: 'Total mentee applications from last month',
    type: Number,
    example: 14,
  })
  @IsNumber()
  menteeApplicationsLastMonth: number;

  @ApiProperty({
    description: 'Total mentor applications from current month',
    type: Number,
    example: 14,
  })
  @IsNumber()
  mentorApplicationsCurrentMonth: number;

  @ApiProperty({
    description: 'Total mentee applications from current month',
    type: Number,
    example: 14,
  })
  @IsNumber()
  menteeApplicationsCurrentMonth: number;
}
