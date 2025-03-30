import { ConnectionRequestsStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterConnectionRequestsDto {
  @ApiPropertyOptional({
    description: 'Request from a specific user',
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  user_id?: number;

  @ApiPropertyOptional({
    description:
      'Status of the connection request [ PENDING | APPROVED | REJECTED]',
    example: 'APPROVED',
  })
  @IsEnum(ConnectionRequestsStatus)
  @IsOptional()
  status?: ConnectionRequestsStatus;

  @ApiPropertyOptional({
    description:
      '`created_at` greater than inserted date, ignoring time. `Y-m-d 00:00:00.000`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  date_from?: Date; // Format ISO 8601

  @ApiPropertyOptional({
    description:
      '`created_at` lower than inserted date, ignoring time. `Y-m-d 59:59:59.999`',
    example: '2025-01-05',
  })
  @IsDateString()
  @IsOptional()
  date_to?: Date; // Format ISO 8601
}

export class FilterConnectedUsersDto {}

export class FilterMessagesDto {}
