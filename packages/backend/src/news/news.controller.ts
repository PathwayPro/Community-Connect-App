import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles, GetUser, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FilterNewsDto } from './dto/filter-news.dto';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { News } from './entities/news.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateNewsDto })
  @ApiCreatedResponse({ type: News })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the news: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create news record',
    description:
      'Creates news or throws Internal Server Error Exception. \n\n Using form-data for images (file) \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const newNews: CreateNewsDto = {
      title: createNewsDto.title,
      details: createNewsDto.details,
      type: createNewsDto.type,
      link: createNewsDto.link,
      published:
        typeof createNewsDto.published === 'string'
          ? createNewsDto.published === 'true'
          : createNewsDto.published,
    };
    console.log('CREATE NEWS:', newNews);
    return this.newsService.create(user.sub, newNews, file);
  }

  @Roles('ADMIN')
  @Get('/admin')
  @ApiQuery({ type: FilterNewsDto })
  @ApiOkResponse({ type: News, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching news: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch news (public and private)',
    description:
      'Fetch news with admin privilege to get also private ones. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  findAllAdmin(@Query() filterNewsDto: FilterNewsDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterNewsDto.date_to
      ? new Date(filterNewsDto.date_to)
      : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const filters = {
      ...filterNewsDto,
      user_id: filterNewsDto.user_id ? +filterNewsDto.user_id : null,
      date_from: filterNewsDto.date_from
        ? new Date(filterNewsDto.date_from)
        : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };

    return this.newsService.findAll(filters);
  }

  @Public()
  @Get()
  @ApiQuery({ type: FilterNewsDto })
  @ApiOkResponse({ type: News, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching news: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch news (only public)',
    description:
      'Fetch published news for public access. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAllPublic(@Query() filterNewsDto: FilterNewsDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterNewsDto.date_to
      ? new Date(filterNewsDto.date_to)
      : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const filters = {
      ...filterNewsDto,
      user_id: filterNewsDto.user_id ? +filterNewsDto.user_id : null,
      date_from: filterNewsDto.date_from
        ? new Date(filterNewsDto.date_from)
        : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
      published: true,
    };

    return this.newsService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: News })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching news: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no News with ID #[:id]' })
  @ApiOperation({
    summary: 'Fetch news by ID (only public)',
    description:
      'Fetch one published news by ID for public access. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOnePublic(@Param('id') id: string) {
    return this.newsService.findOnePublic(+id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdateNewsDto })
  @ApiOkResponse({ type: News })
  @ApiNotFoundResponse({ description: 'There is no News with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating news with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update news (public and private)',
    description:
      'Update news with ID. \n\n Using form-data for images (file) \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const updateNews: UpdateNewsDto = {
      title: updateNewsDto.title,
      details: updateNewsDto.details,
      type: updateNewsDto.type,
      link: updateNewsDto.link,
      published:
        typeof updateNewsDto.published === 'string'
          ? updateNewsDto.published === 'true'
          : updateNewsDto.published,
    };
    return this.newsService.update(+id, updateNews, file);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiNotFoundResponse({
    description: 'There is no News with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete news (public and private)',
    description: 'Delete news with ID. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
