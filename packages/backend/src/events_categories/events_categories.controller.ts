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
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EventsCategory } from './entities/events_category.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Events Categories')
@Controller('events-categories')
export class EventsCategoriesController {
  constructor(
    private readonly eventsCategoriesService: EventsCategoriesService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiBody({ type: CreateEventsCategoryDto })
  @ApiCreatedResponse({ type: EventsCategory })
  @ApiInternalServerErrorResponse({
    description: 'Error creating category: `[ERROR MESSAGE]`',
  })
  @ApiOperation({
    summary: 'Create new category',
    description:
      'Creates a new category to be assigned to events. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(@Body() createEventsCategoryDto: CreateEventsCategoryDto) {
    const category: CreateEventsCategoryDto = {
      name: createEventsCategoryDto.name,
    };
    return this.eventsCategoriesService.create(category);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: EventsCategory, isArray: true })
  @ApiInternalServerErrorResponse({ description: '`[ERROR MESSAGE]`' })
  @ApiOperation({
    summary: 'Find all categories',
    description:
      'Returns all the available categories for events. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAll() {
    return this.eventsCategoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: EventsCategory })
  @ApiInternalServerErrorResponse({ description: '`[ERROR MESSAGE]`' })
  @ApiNotFoundResponse({ description: 'There is no category with ID: `:id`.' })
  @ApiOperation({
    summary: 'Find by ID',
    description:
      'Returns the category according to the given ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.eventsCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateEventsCategoryDto })
  @ApiCreatedResponse({ type: EventsCategory })
  @ApiInternalServerErrorResponse({ description: '`[ERROR MESSAGE]`' })
  @ApiNotFoundResponse({ description: 'Category with ID: `:id` not found.' })
  @ApiOperation({
    summary: 'Update category name',
    description:
      'Updates the name of the category and returns the updates result. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
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
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: String })
  @ApiOperation({
    summary: ' - PENDING - ',
    description:
      'Should we remove a category or add another field to stop showing in results, but keep the original to prevent errors in events assigned to that category?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return id;
    //return this.eventsCategoriesService.remove(+id);
  }
}
