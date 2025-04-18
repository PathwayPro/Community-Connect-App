import { mentees_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class FilterMenteeDto {
  @ApiPropertyOptional({
    description: 'Filter by application status',
    example: 'PENDING',
    enum: mentees_status,
  })
  @IsEnum(mentees_status)
  @IsOptional()
  status?: mentees_status;
}
