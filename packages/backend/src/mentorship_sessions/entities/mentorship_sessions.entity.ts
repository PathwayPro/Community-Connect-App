import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsNotEmpty,
  IsUrl,
  IsDate,
  IsEnum,
} from 'class-validator';
import { matching_status } from '@prisma/client';

export class MentorshipSessionEntity {
  @ApiProperty({
    description: 'Unique identifier for the mentorship session',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the mentor user',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  mentorId: number;

  @ApiProperty({
    description: 'ID of the mentee user',
    example: 15,
  })
  @IsInt()
  @IsNotEmpty()
  menteeId: number;

  @ApiProperty({
    description: 'Meeting link for the session',
    example: 'https://meet.google.com/abc-defg-hij',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiProperty({
    description: 'Start date and time of the session',
    example: '2024-01-15T14:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    description: 'End date and time of the session',
    example: '2024-01-15T15:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-10T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-10T10:00:00Z',
  })
  updatedAt: Date;
}

export class MentorshipSessionDescriptionEntity {
  @ApiProperty({
    description: 'Unique identifier for the session description',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the mentorship session',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sessionId: number;

  @ApiProperty({
    description: 'Description of the session',
    example:
      'Technical interview preparation focusing on system design questions',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class MentorshipSessionMenteeNotesEntity {
  @ApiProperty({
    description: 'Unique identifier for the mentee notes',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the mentorship session',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  sessionId: number;

  @ApiProperty({
    description: 'Notes taken by the mentee during the session',
    example:
      'Learned about microservices architecture and best practices for scaling applications',
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}

export class MentorshipSessionRatingEntity {
  @ApiProperty({
    description: 'Unique identifier for the session rating',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ID of the mentorship session', example: 1 })
  @IsInt()
  @IsNotEmpty()
  sessionId: number;

  @ApiProperty({
    description: 'Rating given (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsNotEmpty()
  rate: number;

  @ApiProperty({
    description: 'Comment about the session',
    example: 'Great session!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Creation timestamp of the rating',
    example: '2024-01-15T16:00:00Z',
  })
  createdAt: Date;

  // Add session property
  @ApiProperty({ description: 'Session information', required: false })
  @IsOptional()
  session?: any;
}

export class MatchedMentorMenteeEntity {
  @ApiProperty({
    description: 'Unique identifier for the mentor-mentee match',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the mentor user',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  mentorId: number;

  @ApiProperty({
    description: 'ID of the mentee user',
    example: 15,
  })
  @IsInt()
  @IsNotEmpty()
  menteeId: number;

  @ApiProperty({
    description: 'Status of the mentor-mentee match',
    example: 'APPROVED',
    enum: matching_status,
  })
  @IsEnum(matching_status)
  @IsNotEmpty()
  status: matching_status;

  @ApiProperty({
    description: 'Creation timestamp of the match',
    example: '2024-01-10T10:00:00Z',
  })
  createdAt: Date;
}

// Response DTOs for better API documentation
export class MentorshipSessionResponseEntity extends MentorshipSessionEntity {
  @ApiProperty({
    description: 'Mentor user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 10 },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      email: { type: 'string', example: 'john.doe@example.com' },
    },
  })
  mentor?: any;

  @ApiProperty({
    description: 'Mentee user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 15 },
      firstName: { type: 'string', example: 'Jane' },
      lastName: { type: 'string', example: 'Smith' },
      email: { type: 'string', example: 'jane.smith@example.com' },
    },
  })
  mentee?: any;

  @ApiProperty({
    description: 'Session description',
    type: MentorshipSessionDescriptionEntity,
    required: false,
  })
  description?: MentorshipSessionDescriptionEntity;

  @ApiProperty({
    description: 'Mentee notes for the session',
    type: MentorshipSessionMenteeNotesEntity,
    required: false,
  })
  menteeNotes?: MentorshipSessionMenteeNotesEntity;

  @ApiProperty({
    description: 'Mentor rating for the session',
    type: MentorshipSessionRatingEntity,
    required: false,
  })
  mentorRating?: MentorshipSessionRatingEntity;

  @ApiProperty({
    description: 'Mentee rating for the session',
    type: MentorshipSessionRatingEntity,
    required: false,
  })
  menteeRating?: MentorshipSessionRatingEntity;
}

export class MatchedMentorMenteeResponseEntity extends MatchedMentorMenteeEntity {
  @ApiProperty({
    description: 'Mentor user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 10 },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      email: { type: 'string', example: 'john.doe@example.com' },
    },
  })
  mentor?: any;

  @ApiProperty({
    description: 'Mentee user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 15 },
      firstName: { type: 'string', example: 'Jane' },
      lastName: { type: 'string', example: 'Smith' },
      email: { type: 'string', example: 'jane.smith@example.com' },
    },
  })
  mentee?: any;
}
