import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';

@ApiTags('Contact Us')
@UseGuards(JwtAuthGuard)
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Public()
  @Post()
  @ApiOkResponse({ description: 'Successfully created contact request' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create contact request',
  })
  @ApiOperation({ summary: 'Create a new contact request' })
  async create(@Body() createContactUsDto: CreateContactUsDto) {
    return await this.contactUsService.create(createContactUsDto);
  }

  @Public()
  @Patch(':id')
  @ApiOkResponse({ description: 'Successfully updated contact request status' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update contact request status',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ) {
    return await this.contactUsService.updateStatus(+id, updateContactUsDto);
  }

  @Roles('ADMIN')
  @Roles('ADMIN')
  @Get()
  @ApiOkResponse({ description: 'Successfully retrieved all contact requests' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve contact requests',
  })
  @ApiOperation({ summary: 'Get all contact requests' })
  async findAll() {
    return await this.contactUsService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOkResponse({ description: 'Successfully retrieved contact request' })
  @ApiNotFoundResponse({ description: 'Contact request not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve contact request',
  })
  @ApiOperation({ summary: 'Get a specific contact request' })
  async findOne(@Param('id') id: string) {
    return await this.contactUsService.findOne(+id);
  }
}
