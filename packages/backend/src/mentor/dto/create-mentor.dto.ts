import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorDto {
  @ApiProperty({
    description: 'Profession, related to mentoring',
    example: 'Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  profession: string;

  @ApiProperty({
    description: 'Years of experience as a mentor (greater than 0)',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  experience_years: number;

  @ApiProperty({
    description: 'Maximum amount of mentees they can handle',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  max_mentees: number;

  @ApiProperty({
    description: 'Description of availability for mentorship sessions',
    example: 'Monday to Friday after 2PM',
  })
  @IsString()
  @IsNotEmpty()
  availability: string;

  @ApiPropertyOptional({
    description: 'Description of previous experience in mentoring others',
    example: 'I have mentored 15+ junior developers over the past 5 years',
  })
  @IsString()
  @IsOptional()
  experience_details?: string;

  @ApiProperty({
    description: 'Whether the user has previous mentoring experience',
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  has_experience: boolean;

  @ApiProperty({
    description: 'Array of interests IDs to match with mentees',
    example: [8, 5, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    // Handle interests[] format from frontend
    if (Array.isArray(value)) {
      console.log('| - - - - - - - > INTERESTS EN DTO: ARRAY');
      return value.map((item: any) => parseInt(item, 10));
    }
    // Handle single value case (string)
    if (typeof value === 'string') {
      console.log('| - - - - - - - > INTERESTS EN DTO: STRING');
      const interests = value.split(',');
      return interests.map((item: any) => parseInt(item, 10));
    }
    // Handle single value case (number)
    if (typeof value === 'number') {
      console.log('| - - - - - - - > INTERESTS EN DTO: NUMBER');
      return [parseInt(String(value), 10)];
    }
    // Handle object with interests[] keys
    if (typeof value === 'object' && value !== null) {
      console.log('| - - - - - - - > INTERESTS EN DTO: OBJECT');
      const interests = [];
      for (const key in value) {
        if (key.startsWith('interests[') && key.endsWith(']')) {
          interests.push(parseInt(value[key], 10));
        }
      }
      return interests;
    }
    return [];
  })
  interests?: number[];
}

export class CreateMentorFormDto extends CreateMentorDto {
  @ApiProperty({
    description: 'Resume file (.doc, .pdf, .txt, up to 10MB)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
