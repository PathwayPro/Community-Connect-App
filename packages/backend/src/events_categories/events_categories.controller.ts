import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventsCategoriesService } from './events_categories.service';
import { CreateEventsCategoryDto } from './dto/create-events_category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events_category.dto';
import { Public, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events-categories')
export class EventsCategoriesController {
  constructor(
    private readonly eventsCategoriesService: EventsCategoriesService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createEventsCategoryDto: CreateEventsCategoryDto) {
    const category: CreateEventsCategoryDto = {
      name: createEventsCategoryDto.name,
    };
    return this.eventsCategoriesService.create(category);
  }

  @Get()
  @Public()
  findAll() {
    return this.eventsCategoriesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.eventsCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
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
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return id;
    //return this.eventsCategoriesService.remove(+id);
  }
}
