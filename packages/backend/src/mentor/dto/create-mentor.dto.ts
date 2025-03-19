import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorDto {
  @ApiProperty({ description: 'Profession, related to mentoring' })
  @IsString()
  profession: string;

  @ApiProperty({
    description: 'Years of experience as a mentor (greater than 0)',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  experience_years: number;

  @ApiProperty({
    description: 'Maximum amount of mentees they can handle',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  max_mentees: number;

  @ApiProperty({
    description: 'Description of availability for mentorship sessions',
    example: 'Monday to Friday after 2PM',
  })
  @IsString()
  availability: string;

  @ApiPropertyOptional({
    description: 'Description of previous experience in mentoring others',
  })
  @IsString()
  @IsOptional()
  experience_details?: string;

  @ApiProperty({
    description: 'Array of interests IDs to match with mentees (String)',
    example: '[1, 2, 3]',
  })
  @IsString()
  @IsOptional()
  interests: string;
}
