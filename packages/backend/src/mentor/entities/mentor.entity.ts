import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { mentors_status, matching_status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Mentors {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  resume: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(5)
  max_mentees: number;

  @ApiProperty()
  @IsString()
  availability: string;

  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  experience_years: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  experience_details?: string;

  @ApiProperty()
  @IsEnum(mentors_status)
  status: mentors_status = 'PENDING';

  @ApiProperty()
  @IsInt()
  user_id: number;
}

export class MentorStatistics {
  @ApiProperty({ description: 'Total minutes mentored', example: 1893 })
  @IsNumber()
  minutesMentored: number = 0;

  @ApiProperty({
    description: 'Percentage difference with previous month',
    example: 25.5,
  })
  @IsNumber()
  minutesMentoredDiff: number = 0;

  @ApiProperty({ description: 'Total number of mentees', example: 15 })
  @IsNumber()
  mentees: number = 0;

  @ApiProperty({
    description: 'Percentage difference with previous month',
    example: -2.5,
  })
  @IsNumber()
  menteesDiff: number = 0;

  @ApiProperty({ description: 'Total number of live sessions', example: 64 })
  @IsNumber()
  liveSessions: number = 0;

  @ApiProperty({
    description: 'Percentage difference with previous month',
    example: -10.0,
  })
  @IsNumber()
  liveSessionsDiff: number = 0;
}

export class MentorUpcomingSessions {
  @ApiProperty({ description: 'ID of the upcoming session', example: '10' })
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'Profile picture of the mentee',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Full name of the mentee', example: 'John Doe' })
  @IsString()
  mentee: string;

  @ApiProperty({
    description: 'Last session with the mentee',
    example: '2024-01-15T14:00:00Z',
  })
  @IsOptional()
  @IsString()
  lastMet?: string;

  @ApiProperty({
    description: 'Profession of the mentee',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiProperty({
    description: 'Link for the upcoming session',
    example: 'https://meet.google.com/abc-defg-hij',
  })
  @IsOptional()
  @IsString()
  link?: string;
}

export class MyMentees {
  @ApiProperty({ description: 'ID of the mentee', example: '10' })
  @IsNumber()
  id?: number;

  @ApiProperty({ description: 'User ID of the mentee', example: '25' })
  @IsNumber()
  menteeUserId?: number;

  @ApiProperty({
    description: 'Full name of the mentee',
    example: 'Jane Smith',
  })
  @IsString()
  mentee: string;

  @ApiProperty({
    description: 'Email of the mentee',
    example: 'jane.smith@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Profession of the mentee',
    example: 'Data Scientist',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiProperty({
    description: 'Resume path or URL from mentees table',
    example: 'uploads/resumes/abc123.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  resume?: string;

  @ApiProperty({
    description: 'Status of the matching',
    example: 'APPROVED',
    enum: matching_status,
  })
  @IsEnum(matching_status)
  status: matching_status;
}

export class MyMentorDashboard {
  @ApiProperty({ description: 'Mentor statistics', type: MentorStatistics })
  @IsObject()
  statistics: MentorStatistics;

  @ApiProperty({
    description: 'List of upcoming sessions',
    type: [MentorUpcomingSessions],
  })
  @IsArray()
  upcomingSessions: MentorUpcomingSessions[];

  @ApiProperty({ description: 'List of mentees', type: [MyMentees] })
  @IsArray()
  mentees: MyMentees[];
}
