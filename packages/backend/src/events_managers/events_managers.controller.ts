import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventsManagersService } from './events_managers.service';
import { CreateEventsManagerDto } from './dto/create-events_manager.dto';
import { UpdateEventsManagerDto } from './dto/update-events_manager.dto';
import { FilterEventsManagerDto } from './dto/filter-events_manager.dto';
import { DeleteEventsManagerDto } from './dto/delete-events_manager.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events-managers')
export class EventsManagersController {
  constructor(private readonly eventsManagersService: EventsManagersService) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsManagerDto: CreateEventsManagerDto,
  ) {
    const newManager: CreateEventsManagerDto = {
      user_id:
        user.roles === 'MENTOR' ? user.sub : createEventsManagerDto.user_id,
      event_id: createEventsManagerDto.event_id,
      is_speaker: createEventsManagerDto.is_speaker,
    };
    return this.eventsManagersService.create(newManager);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR')
  findAll(
    @GetUser() user: JwtPayload,
    @Body() filters: FilterEventsManagerDto,
  ) {
    const searchFilters: FilterEventsManagerDto = {
      user_id: user.roles === 'MENTOR' ? user.sub : filters.user_id,
      event_id: filters.event_id,
      is_speaker: filters.is_speaker,
    };

    return this.eventsManagersService.findAll(searchFilters);
  }

  @Put()
  @Roles('ADMIN', 'MENTOR')
  switchIsSpeaker(
    @GetUser() user: JwtPayload,
    @Body() updateEventsManagerDto: UpdateEventsManagerDto,
  ) {
    const updateSpeaker: UpdateEventsManagerDto = {
      user_id:
        user.roles === 'MENTOR' ? user.sub : updateEventsManagerDto.user_id,
      event_id: updateEventsManagerDto.event_id,
    };
    return this.eventsManagersService.updateIsSpeaker(updateSpeaker);
  }

  @Delete()
  @Roles('ADMIN', 'MENTOR')
  remove(
    @GetUser() user: JwtPayload,
    @Body() deleteEventsManagerDto: DeleteEventsManagerDto,
  ) {
    const removeManager: DeleteEventsManagerDto = {
      user_id:
        user.roles === 'MENTOR' ? user.sub : deleteEventsManagerDto.user_id,
      event_id: deleteEventsManagerDto.event_id,
    };
    return this.eventsManagersService.remove(removeManager);
  }
}
