import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Roles, GetUser, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
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
  ApiConsumes,
} from '@nestjs/swagger';
import { Resource } from './entities/resource.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles('ADMIN', 'MENTOR')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateResourceDto })
  @ApiCreatedResponse({ type: Resource })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the resource: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create resource record',
    description:
      'Creates resources or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **ADMIN | MENTOR**',
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourcesService.create(user, createResourceDto, file);
  }

  @Public()
  @Get()
  @ApiQuery({ type: FilterResourceDto })
  @ApiOkResponse({ type: Resource, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching resources: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch resources',
    description:
      'Fetch resources for public access. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAll(@Query() filterResourceDto: FilterResourceDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterResourceDto.date_to
      ? new Date(filterResourceDto.date_to)
      : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const appliedFilters: FilterResourceDto = {
      title: filterResourceDto.title,
      details: filterResourceDto.details,
      type: filterResourceDto.type,
      user_id: filterResourceDto.user_id,
      date_from: filterResourceDto.date_from
        ? new Date(filterResourceDto.date_from)
        : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
      file: filterResourceDto.file,
    };
    return this.resourcesService.findAll(appliedFilters);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Resource })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching resource: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no Resource with ID #[:id]' })
  @ApiOperation({
    summary: 'Fetch resources by ID',
    description: 'Fetch one resource by ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateResourceDto })
  @ApiOkResponse({ type: Resource })
  @ApiNotFoundResponse({ description: 'There is no Resource with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating resource with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update resources',
    description:
      'Update resources with ID [:id]. \n\n REQUIRED ROLES: **ADMIN | MENTOR** \n\n **VALIDATIONS:** \n\n * ADMIN USERS CAN UPDATE ANY RESOURCE \n\n * MENTORS CAN ONLY UPDATE RESOURCES CREATED BY THEM',
  })
  @ApiBearerAuth()
  update(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourcesService.update(user, +id, updateResourceDto, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiOkResponse({ type: Resource })
  @ApiNotFoundResponse({
    description: 'There is no Resource with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete resources',
    description:
      'Delete resource with ID [:id]. \n\n REQUIRED ROLES: **ADMIN | MENTOR** \n\n **VALIDATIONS:** \n\n * ADMIN USERS CAN DELETE ANY RESOURCE \n\n * MENTORS CAN ONLY DELETE RESOURCES CREATED BY THEM',
  })
  @ApiBearerAuth()
  remove(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.resourcesService.remove(user, +id);
  }
}
