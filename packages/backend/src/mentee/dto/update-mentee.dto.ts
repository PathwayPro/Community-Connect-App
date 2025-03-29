import { PartialType } from '@nestjs/mapped-types';
import { CreateMenteeDto } from './create-mentee.dto';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { mentees_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateMenteeDto extends PartialType(CreateMenteeDto) {
  @ApiPropertyOptional({ description: 'Reason to be mentored' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Array of interests IDs to match with mentees (Number[])',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value).map((item: any) => parseInt(item, 10));
    } else if (Array.isArray(value)) {
      return value.map((item: any) => parseInt(item, 10));
    } else {
      return [];
    }
  })
  interests?: number[];
}

export class UpdateMenteeStatusDto extends PartialType(CreateMenteeDto) {
  @ApiPropertyOptional({
    description: 'New status for this application',
    example: 'APPROVED',
    enum: mentees_status,
  })
  @IsEnum(mentees_status)
  @IsOptional()
  status?: mentees_status;
}
