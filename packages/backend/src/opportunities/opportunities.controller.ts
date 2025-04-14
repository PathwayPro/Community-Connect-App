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
import { Roles, Public } from 'src/auth/decorators';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { FilterOpportunityDto } from './dto/filter-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { Opportunity, OpportunityCard } from './entities/opportunity.entity';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
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
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateOpportunityDto })
  @ApiCreatedResponse({ type: Opportunity })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the opportunity: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create opportunity',
    description:
      'Creates opportunity or throws Internal Server Error Exception. \n\n Using form-data for company logo (file) \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(
    @Body() createOpportunityDto: CreateOpportunityDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    console.log('createOpportunityDto :', createOpportunityDto);

    const newOpportunity: CreateOpportunityDto = {
      job: createOpportunityDto.job,
      company: createOpportunityDto.company,
      province: createOpportunityDto.province,
      city: createOpportunityDto.city,
      salary_range_id: +createOpportunityDto.salary_range_id,
      settings: createOpportunityDto.settings,
      link_apply: createOpportunityDto.link_apply,
      link_post: createOpportunityDto.link_post,
      description: createOpportunityDto.description,
      experience: createOpportunityDto.experience,
    };

    console.log('newOpportunity :', newOpportunity);
    return this.opportunitiesService.create(newOpportunity, file);
  }

  @Public()
  @Get()
  @ApiQuery({ type: FilterOpportunityDto })
  @ApiOkResponse({ type: OpportunityCard, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching opportunities: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch opportunities',
    description:
      'Fetch opportunities with filters. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  @ApiBearerAuth()
  findAll(@Query() filterOpportunityDto: FilterOpportunityDto) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filterOpportunityDto.date_to
      ? new Date(filterOpportunityDto.date_to)
      : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const filters = {
      ...filterOpportunityDto,
      date_from: filterOpportunityDto.date_from
        ? new Date(filterOpportunityDto.date_from)
        : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };
    return this.opportunitiesService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Opportunity })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching opportunity: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({
    description: 'There is no Job Opportunity with ID #[:id]',
  })
  @ApiOperation({
    summary: 'Fetch opportunity by ID',
    description:
      'Fetch one job opportunity by ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(+id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdateOpportunityDto })
  @ApiOkResponse({ type: Opportunity })
  @ApiNotFoundResponse({
    description: 'There is no opportunity with ID #[:id]',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error updating opportunity with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update opportunity',
    description:
      'Update opportunity with ID. \n\n Using form-data for company logo (file) \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const updateOpportunity: UpdateOpportunityDto = {
      job: updateOpportunityDto.job,
      company: updateOpportunityDto.company,
      province: updateOpportunityDto.province,
      city: updateOpportunityDto.city,
      experience: updateOpportunityDto.experience,
      salary_range_id: +updateOpportunityDto.salary_range_id,
      settings: updateOpportunityDto.settings,
      link_apply: updateOpportunityDto.link_apply,
      link_post: updateOpportunityDto.link_post,
      description: updateOpportunityDto.description,
    };

    return this.opportunitiesService.update(+id, updateOpportunity, file);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOkResponse({ type: Opportunity })
  @ApiNotFoundResponse({
    description: 'There is no Opportunity with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete opportunity',
    description: 'Delete opportunity with ID. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.opportunitiesService.remove(+id);
  }
}
