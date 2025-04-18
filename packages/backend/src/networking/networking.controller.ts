import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { NetworkingService } from './networking.service';
import {
  CreateConnectionRequestsDto,
  CreateMessagesDto,
} from './dto/create-networking.dto';
import { UpdateConnectionRequestsDto } from './dto/update-networking.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FilterConnectionRequestsDto } from './dto/filter-networking.dto';
import {
  ConnectionRequest,
  Connections,
  Message,
  ChatList,
} from './entities/networking.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Networking')
@Controller('networking')
export class NetworkingController {
  constructor(private readonly networkingService: NetworkingService) {}

  // CONNECTIONS FLOW
  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('connect')
  @ApiOkResponse({ type: ConnectionRequest })
  @ApiBadRequestResponse({
    description: 'There is no user with ID [:recipient_id]',
  })
  @ApiUnauthorizedResponse({
    description: 'There is already a connection request between these users',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error creating the connection requerst. Try again later',
  })
  @ApiOperation({
    summary: 'Create a connection request',
    description: `
    \n Create a connection request between the logged user (sender) and another user (recipient)
    \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
    \n\n **VALIDATIONS:**
    \n\n * There is no previous connection request between these users
    \n\n * The connection request will be created with status "PENDING"
  `,
  })
  createConnectionRequest(
    @GetUser() user: JwtPayload,
    @Body() createConnectionRequestsDto: CreateConnectionRequestsDto,
  ) {
    const connectionRequest: CreateConnectionRequestsDto = {
      recipient_id: createConnectionRequestsDto.recipient_id,
      message: createConnectionRequestsDto.message,
    };
    return this.networkingService.createConnectionRequest(
      user.sub,
      connectionRequest,
    );
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Put('connect/:connectionRequestId')
  @ApiBody({ type: UpdateConnectionRequestsDto })
  @ApiParam({ name: 'connectionRequestId' })
  @ApiOkResponse({ type: ConnectionRequest })
  @ApiBadRequestResponse({
    description:
      'There is no connection request with ID [:connectionRequestId]',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not allowed to change this connection request status',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error creating the connection. Please try again later.',
  })
  @ApiOperation({
    summary: 'Update connection request status',
    description: `
    \n Update connection request status:
    \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
    \n\n **VALIDATIONS:**
    \n\n * The "recipient" user is the only one allowed to change the connection request status [APPROVED | REJECTED]
    \n\n * If the status is "APPROVED", the connection between users will be created
  `,
  })
  updateConnectionRequestStatus(
    @GetUser() user: JwtPayload,
    @Param('connectionRequestId') id: string,
    @Body() updateConnectionRequestsDto: UpdateConnectionRequestsDto,
  ) {
    const connectionRequestStatus: UpdateConnectionRequestsDto = {
      status: updateConnectionRequestsDto.status,
    };
    return this.networkingService.updateConnectionRequestStatus(
      +id,
      user.sub,
      connectionRequestStatus,
    );
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('connect')
  @ApiOkResponse({ type: ConnectionRequest, isArray: true })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error fetching your connection requests. Please try again later.',
  })
  @ApiOperation({
    summary: 'Get connection requests',
    description: `
    \n List of the connection requests for the logged user (sent and received) 
    \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
  `,
  })
  findAllConnectionRequest(
    @GetUser() user: JwtPayload,
    @Query() filters: FilterConnectionRequestsDto,
  ) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const appliedFilters: FilterConnectionRequestsDto = {
      user_id: +filters.user_id,
      status: filters.status,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };
    console.log('APPLIED FILTERS - CONTROLLER:', appliedFilters);
    return this.networkingService.findAllConnectionRequest(
      user.sub,
      appliedFilters,
    );
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('connect/:connectionRequestId')
  @ApiParam({ name: 'connectionRequestId' })
  @ApiOkResponse({ type: ConnectionRequest })
  @ApiBadRequestResponse({
    description: `The connection request doesn't exist or is not associated to your user`,
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Fetch connection request by ID',
    description: `Fetch one connection request by ID. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**\n\n **VALIDATIONS:**\n\n * The user can only fetch connection requests where they are sender or recipient`,
  })
  findOneConnectionRequest(
    @GetUser() user: JwtPayload,
    @Param('connectionRequestId') id: string,
  ) {
    return this.networkingService.findOneConnectionRequest(+id, user.sub);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('connected')
  @ApiOkResponse({ type: Connections, isArray: true })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Fetch connections',
    description: `Fetch approved connections for the logged user. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**\n\n **VALIDATIONS:**\n\n * The user can only fetch APPROVED connections where they are sender or recipient`,
  })
  connections(@GetUser('sub') userId: number) {
    return this.networkingService.connections(userId);
  }

  // MESSAGES FLOW
  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('messages')
  @ApiOkResponse({ type: Message })
  @ApiUnauthorizedResponse({
    description:
      'You are not authorized to contact this user. Send a connection request instead',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error sending your message. Please try again later.',
  })
  @ApiOperation({
    summary: 'Create a message',
    description: `
   \n Creates a message from the logged user to the \`recipient_id\` user.
   \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
   \n\n **VALIDATIONS:**
   \n\n * Users must be connected before the message is created
 `,
  })
  createMessage(
    @GetUser() user: JwtPayload,
    @Body() createMessagesDto: CreateMessagesDto,
  ) {
    const newMessage: CreateMessagesDto = {
      recipient_id: createMessagesDto.recipient_id,
      message: createMessagesDto.message,
    };
    return this.networkingService.createMessage(user.sub, newMessage);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('messages/list')
  @ApiOkResponse({ type: ChatList, isArray: true })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Fetch chat list',
    description: `
    \n Fetch the complete chat list for the logged user. 
    \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
    \n\n **VALIDATIONS:**\n\n * The user can only fetch chats where they are the sender or the recipient
  `,
  })
  chatList(@GetUser('sub') userId: number) {
    return this.networkingService.chatList(userId);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('messages/:userId')
  @ApiOkResponse({ type: Message, isArray: true })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Fetch messages with a user',
    description: `
    \n Fetch the complete chat with another user
    \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
    \n\n **VALIDATIONS:**
    \n\n * The user can only fetch messages where they are the sender or the recipient
    \n\n * The messages listed will be between the logged user and the \`userId\` in the param
  `,
  })
  chat(@GetUser('sub') userId: number, @Param('userId') userChat: string) {
    return this.networkingService.chat(userId, +userChat);
  }
}
