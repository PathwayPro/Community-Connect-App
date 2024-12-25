import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsCategoriesService } from './events_categories.service';
import { CreateEventsCategoryDto } from './dto/create-events_category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events_category.dto';
import { Public } from 'src/auth/decorators';

@Public()
@Controller('events-categories')
export class EventsCategoriesController {
  constructor(
    private readonly eventsCategoriesService: EventsCategoriesService,
  ) {}

  @Post()
  create(@Body() createEventsCategoryDto: CreateEventsCategoryDto) {
    const category: CreateEventsCategoryDto = {
      name: createEventsCategoryDto.name,
    };
    return this.eventsCategoriesService.create(category);
  }

  @Get()
  findAll() {
    return this.eventsCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventsCategoryDto: UpdateEventsCategoryDto,
  ) {
    const category: UpdateEventsCategoryDto = {
      name: updateEventsCategoryDto.name,
    };
    return this.eventsCategoriesService.update(+id, category);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return id;
    //return this.eventsCategoriesService.remove(+id);
  }
}
