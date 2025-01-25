import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { CreateConnectionRequestsDto, CreateConnectedUsersDto, CreateMessagesDto } from './dto/create-networking.dto';
import { UpdateConnectionRequestsDto, UpdateConnectedUsersDto, UpdateMessagesDto } from './dto/update-networking.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FilterConnectionRequestsDto } from './dto/filter-networking.dto';

@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('networking')
export class NetworkingController {
  constructor(private readonly networkingService: NetworkingService) {}

  // CONNECTIONS FLOW
  @Roles('ADMIN','MENTOR','USER')
  @Post('connect')
  createConnectionRequest(@GetUser() user: JwtPayload, @Body() createConnectionRequestsDto: CreateConnectionRequestsDto) {
    const connectionRequest:CreateConnectionRequestsDto = {
      sender_id: user.sub,
      recipient_id: createConnectionRequestsDto.recipient_id,
      message: createConnectionRequestsDto.message,
      status: 'PENDING'
    }
    return this.networkingService.createConnectionRequest(connectionRequest);
  }

  @Roles('ADMIN','MENTOR','USER')
  @Put('connect/:connectionRequestId')
  updateConnectionRequestStatus(@GetUser() user: JwtPayload, @Param('connectionRequestId') id: string, @Body() updateConnectionRequestsDto: UpdateConnectionRequestsDto) {
    const connectionRequestStatus:UpdateConnectionRequestsDto = {
      status: updateConnectionRequestsDto.status
    }
    return this.networkingService.updateConnectionRequestStatus(+id, user.sub, connectionRequestStatus);
  }

  @Roles('ADMIN','MENTOR','USER')
  @Get('connect')
  findAllConnectionRequest(@GetUser() user: JwtPayload, @Query() filters: FilterConnectionRequestsDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
    if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

    const appliedFilters: FilterConnectionRequestsDto = {
      user_id: filters.user_id,
      status: filters.status,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null
    } 
    console.log('APPLIED FILTERS - CONTROLLER:', appliedFilters)
    return this.networkingService.findAllConnectionRequest(user.sub, appliedFilters);
  }

  @Roles('ADMIN','MENTOR','USER')
  @Get('connect/:connectionRequestId')
  findOneConnectionRequest(@GetUser() user: JwtPayload, @Param('connectionRequestId') id: string) {
    return this.networkingService.findOneConnectionRequest(+id, user.sub);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('connected')
  connections(@GetUser('sub') userId: number){
    return this.networkingService.connections(userId);
  }

  // MESSAGES FLOW
  @Roles('ADMIN','MENTOR','USER')
  @Post('messages')
  createMessage(@GetUser() user: JwtPayload, @Body() createMessagesDto:CreateMessagesDto){
    const newMessage:CreateMessagesDto = {
      sender_id: user.sub,
      recipient_id: createMessagesDto.recipient_id,
      message: createMessagesDto.message
    }
    return this.networkingService.createMessage(newMessage)
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('messages/list')
  chatList(@GetUser('sub') userId: number){
    return this.networkingService.chatList(userId);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get('messages/:userId')
  chat(@GetUser('sub') userId: number, @Param('userId') userChat: string){
    return this.networkingService.chat(userId, +userChat);
  }

}
