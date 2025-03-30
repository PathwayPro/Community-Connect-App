import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  CreateConnectedUsersDto,
  CreateMessagesDto,
} from './create-networking.dto';
import { ConnectionRequestsStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateConnectionRequestsDto {
  @ApiProperty({
    description: 'New status [PENDING | APPROVED | REJECTED]',
    example: 'APPROVED',
  })
  @IsEnum(ConnectionRequestsStatus)
  status: ConnectionRequestsStatus;
}

export class UpdateConnectedUsersDto extends PartialType(
  CreateConnectedUsersDto,
) {}
export class UpdateMessagesDto extends PartialType(CreateMessagesDto) {}
