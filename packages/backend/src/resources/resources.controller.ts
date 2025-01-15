import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Roles, GetUser, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles('ADMIN', 'MENTOR')
  @Post()
  create(@GetUser() user: JwtPayload, @Body() createResourceDto: CreateResourceDto) {
    const newResource = {
      title: createResourceDto.title,
      link: createResourceDto.link
    }
    return this.resourcesService.create(user, newResource);
  }

  @Public()
  @Get()
  findAll(@Query() filterResourceDto: FilterResourceDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterResourceDto.date_to ? new Date(filterResourceDto.date_to) : null;
    if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

    const appliedFilters: FilterResourceDto = {
      title: filterResourceDto.title,
      link: filterResourceDto.link,
      user_id: filterResourceDto.user_id,
      date_from: filterResourceDto.date_from ? new Date(filterResourceDto.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null
    }
    return this.resourcesService.findAll(appliedFilters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch(':id')
  update(@GetUser() user: JwtPayload, @Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    const updateResource = {
      title: updateResourceDto.title,
      link: updateResourceDto.link
    }
    return this.resourcesService.update(user, +id, updateResource);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  remove(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.resourcesService.remove(user, +id);
  }
}
