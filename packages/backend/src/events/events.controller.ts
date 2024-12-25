import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from 'src/auth/decorators';
import { FilterEventDto } from './dto/filter-event.dto';

@Public()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    const newEvent: CreateEventDto = {
      title: createEventDto.title,
      subtitle: createEventDto.subtitle,
      description: createEventDto.description,
      category_id: createEventDto.category_id,
      location: createEventDto.location,
      link: createEventDto.link,
      image: createEventDto.image,
      price: createEventDto.price || 0,
      type: createEventDto.type || 'PUBLIC',
      requires_confirmation: createEventDto.requires_confirmation || false,
      accept_subscriptions: createEventDto.accept_subscriptions || true,
    };
    return this.eventsService.create(newEvent);
  }

  @Get()
  findAll(@Body() filters: FilterEventDto) {
    console.log('price:', filters.price);
    const searchFilters: FilterEventDto = {
      title: filters.title,
      subtitle: filters.subtitle,
      description: filters.description,
      category_id: filters.category_id,
      location: filters.location,
      price: filters.price, // Compared as LOWER THAN
      type: filters.type, // USER: public + invited | MENTOR: Public + personal + invited | ADMIN: *
      accept_subscriptions: filters.accept_subscriptions,
    };
    return this.eventsService.findAll(searchFilters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const updatedEvent: UpdateEventDto = {
      title: updateEventDto.title,
      subtitle: updateEventDto.subtitle,
      description: updateEventDto.description,
      location: updateEventDto.location,
      link: updateEventDto.link,
      image: updateEventDto.image,
      price: updateEventDto.price,
      type: updateEventDto.type,
      requires_confirmation: updateEventDto.requires_confirmation || false,
      accept_subscriptions: updateEventDto.accept_subscriptions || true,
    };
    return this.eventsService.update(+id, updatedEvent);
  }

  @Put(':id')
  toggleSubscription(@Param('id') id: string) {
    return this.eventsService.toggleSubscription(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
