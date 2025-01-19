import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles, GetUser, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FilterNewsDto } from './dto/filter-news.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('ADMIN')
  @Post()
  create(@GetUser() user: JwtPayload, @Body() createNewsDto: CreateNewsDto) {
    const newNews: CreateNewsDto = {
      title: createNewsDto.title,
      subtitle: createNewsDto.subtitle,
      keywords: createNewsDto.keywords,
      content: createNewsDto.content,
      published: createNewsDto.published,
      user_id: user.sub,
    };
    return this.newsService.create(user.sub, newNews);
  }
  
  @Roles('ADMIN')
  @Get('/admin')
  findAllAdmin(@Query() filterNewsDto:FilterNewsDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterNewsDto.date_to ? new Date(filterNewsDto.date_to) : null;
    if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

    const filters = {
      ...filterNewsDto,
      user_id: filterNewsDto.user_id ? +filterNewsDto.user_id : null,
      date_from: filterNewsDto.date_from ? new Date(filterNewsDto.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null
    }
    
    return this.newsService.findAll(filters);
  }

  @Public()
  @Get()
  findAllPublic(@Query() filterNewsDto:FilterNewsDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterNewsDto.date_to ? new Date(filterNewsDto.date_to) : null;
    if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

    const filters = {
      ...filterNewsDto,
      user_id: filterNewsDto.user_id ? +filterNewsDto.user_id : null,
      date_from: filterNewsDto.date_from ? new Date(filterNewsDto.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
      published: true
    }
    
    return this.newsService.findAll(filters);
  }

  @Public()
  @Get(':id')
  findOnePublic(@Param('id') id: string) {
    return this.newsService.findOnePublic(+id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const updateNews: UpdateNewsDto = {
      title: updateNewsDto.title,
      subtitle: updateNewsDto.subtitle,
      keywords: updateNewsDto.keywords,
      content: updateNewsDto.content,
      published: updateNewsDto.published,
    };
    return this.newsService.update(+id, updateNews);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
