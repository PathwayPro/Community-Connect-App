import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MentorService } from './mentor.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import {
  UpdateMentorDto,
  UpdateMentorStatusDto,
} from './dto/update-mentor.dto';
import { FilterMentorDto } from './dto/filter-mentor.dto';
import { GetUser, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Mentors } from './entities/mentor.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Mentors')
@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get()
  @Roles('ADMIN')
  @ApiBody({ type: FilterMentorDto })
  @ApiOkResponse({ type: Mentors, isArray: true })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch mentor applications',
    description:
      'Fetch any mentor applications. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  findAll(@Body() filters: FilterMentorDto) {
    return this.mentorService.findAll(filters);
  }

  @Get('my-application')
  @Roles('USER', 'MENTOR', 'ADMIN')
  @ApiOkResponse({ type: Mentors })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch personal mentor applications',
    description:
      'Fetch mentor applications according to logged user ID. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiNotFoundResponse({
    description:
      'There is no mentor application for this user (USER ID: #`:id` )',
  })
  @ApiBearerAuth()
  findMyApplication(@GetUser() user: JwtPayload) {
    return this.mentorService.findOneByUserId(user.sub);
  }

  @Get(':mentorApplicationId')
  @Roles('ADMIN')
  @ApiParam({ name: 'mentorApplicationId' })
  @ApiOkResponse({ type: Mentors })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch one mentor application by ID',
    description:
      'Fetch any mentor application by ID. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiNotFoundResponse({
    description:
      'There is no mentor application with ID: `:mentorApplicationId`. Make sure you are not using a user ID',
  })
  @ApiBearerAuth()
  findOne(@Param('mentorApplicationId') mentorApplicationId: string) {
    return this.mentorService.findOneById(+mentorApplicationId);
  }

  @Post()
  @Roles('USER')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateMentorDto })
  @ApiOkResponse({ type: Mentors })
  @ApiInternalServerErrorResponse({
    description: 'Error creating mentor: `[ERROR MESSAGE]`',
  })
  @ApiOperation({
    summary: 'Create new mentor application',
    description:
      'Create new mentor application for the logged user. Requires "form-data" request with an aditional field type "file" and name "file" with the resume (.doc, .pdf, .txt, up to 10MB) \n\n REQUIRED ROLES: **USER**',
  })
  @ApiBadRequestResponse({ description: 'Mentor already exists' })
  @ApiNotFoundResponse({ description: 'The associated user does not exists' })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createMentorDto: CreateMentorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createMentor: CreateMentorDto = {
      profession: createMentorDto.profession,
      experience_years: +createMentorDto.experience_years,
      max_mentees: +createMentorDto.max_mentees,
      availability: createMentorDto.availability,
      experience_details: createMentorDto.experience_details,
      interests: createMentorDto.interests,
    };
    return this.mentorService.create(user.sub, createMentor, file);
  }

  @Patch()
  @Roles('USER', 'MENTOR', 'ADMIN')
  @ApiBody({ type: UpdateMentorDto })
  @ApiOkResponse({ type: Mentors })
  @ApiInternalServerErrorResponse({
    description: 'Error updating mentor: `[ERROR MESSAGE]`',
  })
  @ApiOperation({
    summary: 'Update personal mentor application',
    description:
      'Update mentor application for the logged user. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiNotFoundResponse({
    description: 'Mentor application for user with ID: `user_id` not found',
  })
  @ApiBearerAuth()
  update(
    @GetUser() user: JwtPayload,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const updatedMentor: UpdateMentorDto = {
      profession: updateMentorDto.profession,
      experience_years: updateMentorDto.experience_years,
      max_mentees: updateMentorDto.max_mentees,
      availability: updateMentorDto.availability,
      experience_details: updateMentorDto.experience_details,
      interests: updateMentorDto.interests,
    };
    return this.mentorService.update(+user.sub, updatedMentor);
  }

  @Put(':mentorApplicationId')
  @Roles('ADMIN')
  @ApiParam({ name: 'mentorApplicationId' })
  @ApiBody({ type: UpdateMentorStatusDto })
  @ApiOkResponse({ type: Mentors })
  @ApiOperation({
    summary: 'Update mentor application status',
    description:
      'Updates mentor application status and changes the user role according to the application status. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error updating the mentor application status with ID: `:mentorApplicationId`',
  })
  @ApiNotFoundResponse({
    description:
      'Mentor application with ID: `:mentorApplicationId` not found.',
  })
  @ApiBadRequestResponse({
    description: 'Error updating mentor application status: `[ERROR MESSAGE]`',
  })
  @ApiBearerAuth()
  updateStatus(
    @Param('mentorApplicationId') mentorApplicationId: string,
    @Body() updateMentorStatusDto: UpdateMentorStatusDto,
  ) {
    const updatedMentor: UpdateMentorStatusDto = {
      status: updateMentorStatusDto.status,
    };
    return this.mentorService.updateStatus(+mentorApplicationId, updatedMentor);
  }

  // TO-DO: REMOVE MENTOR INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: String })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: String })
  @ApiOperation({
    summary: '**[PENDING]**',
    description:
      'REMOVE MENTOR INFORMATION OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  remove(@Param('id') id: string) {
    return this.mentorService.remove(+id);
  }
}
