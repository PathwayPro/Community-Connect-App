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
import { MenteeService } from './mentee.service';
import { CreateMenteeDto } from './dto/create-mentee.dto';
import {
  UpdateMenteeDto,
  UpdateMenteeStatusDto,
} from './dto/update-mentee.dto';
import { FilterMenteeDto } from './dto/filter-mentee.dto';
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
import { Mentees } from './entities/mentee.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Mentees')
@Controller('mentees')
export class MenteeController {
  constructor(private readonly menteeService: MenteeService) {}

  @Get()
  @Roles('ADMIN')
  @ApiBody({ type: FilterMenteeDto })
  @ApiOkResponse({ type: Mentees, isArray: true })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch mentee applications',
    description:
      'Fetch any mentee applications. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  findAll(@Body() filters: FilterMenteeDto) {
    return this.menteeService.findAll(filters);
  }

  @Get('my-application')
  @Roles('USER', 'MENTOR', 'ADMIN')
  @ApiOkResponse({ type: Mentees })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch personal mentee applications',
    description:
      'Fetch mentee applications according to logged user ID. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiNotFoundResponse({
    description:
      'There is no mentee application for this user (USER ID: #`:id` )',
  })
  @ApiBearerAuth()
  findMyApplication(@GetUser() user: JwtPayload) {
    return this.menteeService.findOneByUserId(user.sub);
  }

  @Get(':menteeApplicationId')
  @Roles('ADMIN')
  @ApiParam({ name: 'menteeApplicationId' })
  @ApiOkResponse({ type: Mentees })
  @ApiInternalServerErrorResponse({ description: `[ERROR MESSAGE]` })
  @ApiOperation({
    summary: 'Fetch one mentee application by ID',
    description:
      'Fetch any mentee application by ID. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiNotFoundResponse({
    description:
      'There is no mentee application with ID: `:menteeApplicationId`. Make sure you are not using a user ID',
  })
  @ApiBearerAuth()
  findOne(@Param('menteeApplicationId') menteeApplicationId: string) {
    return this.menteeService.findOneById(+menteeApplicationId);
  }

  @Post()
  @Roles('USER')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateMenteeDto })
  @ApiOkResponse({ type: Mentees })
  @ApiInternalServerErrorResponse({
    description: 'Error creating mentee: `[ERROR MESSAGE]`',
  })
  @ApiOperation({
    summary: 'Create new mentee application',
    description:
      'Create new mentee application for the logged user. Requires "form-data" request with an aditional field type "file" and name "file" with the resume (.doc, .pdf, .txt, up to 10MB) \n\n REQUIRED ROLES: **USER**',
  })
  @ApiBadRequestResponse({ description: 'Mentee already exists' })
  @ApiNotFoundResponse({ description: 'The associated user does not exists' })
  @ApiBearerAuth()
  async create(
    @GetUser() user: JwtPayload,
    @Body() createMenteeDto: CreateMenteeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createMentee: CreateMenteeDto = {
      reason: createMenteeDto.reason,
      interests: createMenteeDto.interests,
    };
    return await this.menteeService.create(user.sub, createMentee, file);
  }

  @Patch()
  @Roles('USER', 'MENTOR', 'ADMIN')
  @ApiBody({ type: UpdateMenteeDto })
  @ApiOkResponse({ type: Mentees })
  @ApiInternalServerErrorResponse({
    description: 'Error updating mentee: `[ERROR MESSAGE]`',
  })
  @ApiOperation({
    summary: 'Update personal mentee application',
    description:
      'Update mentee application for the logged user. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiNotFoundResponse({
    description: 'Mentee application for user with ID: `user_id` not found',
  })
  @ApiBearerAuth()
  update(
    @GetUser() user: JwtPayload,
    @Body() updateMenteeDto: UpdateMenteeDto,
  ) {
    const updatedMentee: UpdateMenteeDto = {
      reason: updateMenteeDto.reason,
      interests: updateMenteeDto.interests,
    };
    return this.menteeService.update(+user.sub, updatedMentee);
  }

  @Put(':menteeApplicationId')
  @Roles('ADMIN')
  @ApiParam({ name: 'menteeApplicationId' })
  @ApiBody({ type: UpdateMenteeStatusDto })
  @ApiOkResponse({ type: Mentees })
  @ApiOperation({
    summary: 'Update mentee application status',
    description:
      'Updates mentee application status and changes the user role according to the application status. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error updating the mentee application status with ID: `:menteeApplicationId`',
  })
  @ApiNotFoundResponse({
    description:
      'Mentee application with ID: `:menteeApplicationId` not found.',
  })
  @ApiBadRequestResponse({
    description: 'Error updating mentee application status: `[ERROR MESSAGE]`',
  })
  @ApiBearerAuth()
  updateStatus(
    @Param('menteeApplicationId') menteeApplicationId: string,
    @Body() updateMenteeStatusDto: UpdateMenteeStatusDto,
  ) {
    const updatedMentee: UpdateMenteeStatusDto = {
      status: updateMenteeStatusDto.status,
    };
    return this.menteeService.updateStatus(+menteeApplicationId, updatedMentee);
  }

  @Get('my-dashboard')
  @Roles('USER', 'MENTEE', 'ADMIN')
  @ApiOkResponse({ description: 'Mentee dashboard payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get mentee dashboard',
    description:
      'Returns current mentor profile, statistics, and next session info for the logged mentee. REQUIRED ROLES: USER | MENTEE | ADMIN',
  })
  @ApiBearerAuth()
  async getMyDashboard(@GetUser() user: JwtPayload) {
    return await this.menteeService.getMyDashboard(user.sub);
  }

  @Get('my-past-mentors')
  @Roles('USER', 'MENTEE', 'ADMIN')
  @ApiOkResponse({ description: 'List of past mentors' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get past mentors',
    description:
      'Returns mentors previously matched with the mentee. REQUIRED ROLES: USER | MENTEE | ADMIN',
  })
  @ApiBearerAuth()
  async getMyPastMentors(@GetUser() user: JwtPayload) {
    return await this.menteeService.getMyPastMentors(user.sub);
  }

  @Get('my-notes')
  @Roles('USER', 'MENTEE', 'ADMIN')
  @ApiOkResponse({ description: 'List of mentee notes across sessions' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get mentee notes',
    description:
      'Returns notes the mentee took for mentorship sessions. REQUIRED ROLES: USER | MENTEE | ADMIN',
  })
  @ApiBearerAuth()
  async getMyNotes(@GetUser() user: JwtPayload) {
    return await this.menteeService.getMyNotes(user.sub);
  }

  @Get('my-upcoming-session')
  @Roles('USER', 'MENTEE', 'ADMIN')
  @ApiOkResponse({ description: 'Next upcoming session for mentee' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get mentee upcoming session',
    description:
      'Returns the next upcoming session for the mentee. REQUIRED ROLES: USER | MENTEE | ADMIN',
  })
  @ApiBearerAuth()
  async getMyUpcomingSession(@GetUser() user: JwtPayload) {
    return await this.menteeService.getMyUpcomingSession(user.sub);
  }

  // TO-DO: REMOVE MENTEE INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: String })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: String })
  @ApiOperation({
    summary: '**[PENDING]**',
    description:
      'REMOVE MENTEE INFORMATION OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  remove(@Param('id') id: string) {
    return this.menteeService.remove(+id);
  }
}
