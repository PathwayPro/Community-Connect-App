import { PartialType } from '@nestjs/swagger';
import { CreateConnectionRequestsDto, CreateConnectedUsersDto, CreateMessagesDto } from './create-networking.dto';

export class UpdateConnectionRequestsDto extends PartialType(CreateConnectionRequestsDto) {}
export class UpdateConnectedUsersDto extends PartialType(CreateConnectedUsersDto) {}
export class UpdateMessagesDto extends PartialType(CreateMessagesDto) {}
