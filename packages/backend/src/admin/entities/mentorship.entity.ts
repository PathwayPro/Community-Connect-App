import { ApiProperty } from '@nestjs/swagger';
import { mentors_status } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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

export class MentorshipAdminIdentity {
  @ApiProperty({
    description: 'Mentor avatar',
    type: String,
    example: 'https://github.com/shadcn.png',
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    description: 'Mentor first name',
    type: String,
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Mentor last name',
    type: String,
    example: 'Smith',
  })
  @IsString()
  lastName: string;
}

export class MentorshipAdmin {
  @ApiProperty({ description: 'Mentor ID', type: Number, example: 10 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Mentor identity',
    type: MentorshipAdminIdentity,
  })
  @IsObject()
  identity: MentorshipAdminIdentity;

  @ApiProperty({
    description: 'Mentor experience',
    type: String,
    example: '12 years',
  })
  @IsString()
  experience: string;

  @ApiProperty({
    description: 'Mentor experience description',
    type: String,
    example:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
  })
  @IsString()
  experienceDescription: string;

  @ApiProperty({
    description: 'Mentor profession',
    type: String,
    example: 'Software Architect',
  })
  @IsString()
  profession: string;

  @ApiProperty({
    description: 'Mentor email',
    type: String,
    example: 'john.smith@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Mentor status',
    example: 'APPROVED',
    enumName: 'mentors_status',
  })
  @IsEnum(mentors_status)
  status: mentors_status;

  @ApiProperty({ description: 'Mentor capacity', type: Number, example: 8 })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    description: 'Mentor availability',
    type: String,
    example: '10 hours/week',
  })
  @IsString()
  availability: string;

  @ApiProperty({
    description: 'Mentor last session',
    type: String,
    example: 'Jan 15, 2024',
  })
  @IsString()
  @IsOptional()
  lastSession?: string;

  @ApiProperty({
    description: 'Mentor sessions booked',
    type: Number,
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  sessionsBooked?: number;

  @ApiProperty({ description: 'Mentor ratings', type: Number, example: 4 })
  @IsNumber()
  @IsOptional()
  ratings?: number;
}

export class MenteeAdmin {
  @ApiProperty({ description: 'Mentee ID', type: Number, example: 10 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Mentee identity',
    type: MentorshipAdminIdentity,
  })
  @IsObject()
  identity: MentorshipAdminIdentity;

  @ApiProperty({
    description: 'Mentee date',
    type: String,
    example: '2024-01-15',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Mentee profession',
    type: String,
    example: 'Software Engineer',
  })
  @IsString()
  profession: string;

  @ApiProperty({
    description: 'Mentee status',
    type: String,
    example: 'APPROVED',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Mentee email',
    type: String,
    example: 'john.smith@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Mentee reason',
    type: String,
    example: 'I want to learn how to code',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Mentee experience',
    type: String,
    example: '14 years',
  })
  @IsString()
  experience: string;
}
