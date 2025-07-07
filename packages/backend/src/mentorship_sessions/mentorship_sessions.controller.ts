import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { MentorshipSessionsService } from './mentorship_sessions.service';
import {
  MentorshipSessionEntity,
  MentorshipSessionMenteeNotesEntity,
  MentorshipSessionRatingEntity,
  MatchedMentorMenteeEntity,
} from './entities/mentorship_sessions.entity';
import {
  CreateMentorshipSessionDto,
  CreateSessionMenteeNoteDto,
  CreateSessionRatingDto,
  CreateMatchingDto,
} from './dto/create.dto';
import {
  FilterMentorshipSessionsDto,
  FilterMentorshipSessionRatingsDto,
} from './dto/filter.dto';
import {
  UpdateMentorshipSessionDto,
  UpdateSessionMenteeNoteDto,
  UpdateMatchingDto,
} from './dto/update.dto';
import { Roles, GetUser } from 'src/auth/decorators';
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
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Mentorship Sessions')
@Controller('mentorship-sessions')
export class MentorshipSessionsController {
  constructor(
    private readonly mentorshipSessionsService: MentorshipSessionsService,
  ) {}

  // MENTORSHIP SESSIONS
  @Roles('MENTOR')
  @Post('/mentorship-session')
  @ApiBody({ type: CreateMentorshipSessionDto })
  @ApiCreatedResponse({ type: MentorshipSessionEntity })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the mentorship session: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create mentorship session',
    description:
      'Creates mentorship session or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **MENTOR**',
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createMentorshipSessionDto: CreateMentorshipSessionDto,
  ) {
    const newMentorshipSession: CreateMentorshipSessionDto = {
      menteeId: createMentorshipSessionDto.menteeId,
      link: createMentorshipSessionDto.link,
      dateStart: createMentorshipSessionDto.dateStart,
      dateEnd: createMentorshipSessionDto.dateEnd,
      description: createMentorshipSessionDto.description,
    };
    return this.mentorshipSessionsService.createMentorshipSession(
      user.sub,
      newMentorshipSession,
    );
  }

  @Roles('MENTOR')
  @Put('/mentorship-session/:id')
  @ApiBody({ type: UpdateMentorshipSessionDto })
  @ApiOkResponse({ type: MentorshipSessionEntity })
  @ApiNotFoundResponse({
    description: 'There is no mentorship session with ID #[:id]',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error updating mentorship session with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update mentorship session',
    description:
      'Update mentorship session with ID. \n\n Only the mentor who created the session can update the mentorship session. \n\n REQUIRED ROLES: **MENTOR**',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Body() updateMentorshipSessionDto: UpdateMentorshipSessionDto,
  ) {
    const updateMentorshipSession: UpdateMentorshipSessionDto = {
      link: updateMentorshipSessionDto.link,
      dateStart: updateMentorshipSessionDto.dateStart,
      dateEnd: updateMentorshipSessionDto.dateEnd,
      description: updateMentorshipSessionDto.description,
    };

    return this.mentorshipSessionsService.updateMentorshipSession(
      +id,
      user.sub,
      updateMentorshipSession,
    );
  }

  @Roles('MENTOR')
  @Delete('/mentorship-session/:id')
  @ApiOkResponse({ type: Number })
  @ApiNotFoundResponse({
    description: 'There is no mentorship session with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete mentorship session',
    description:
      'Delete mentorship session with ID. \n\n Only the mentor who created the session can delete the mentorship session. \n\n REQUIRED ROLES: **MENTOR**',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.mentorshipSessionsService.removeMentorshipSession(
      +id,
      user.sub,
    );
  }

  @Roles('MENTOR', 'MENTEE', 'USER')
  @Get('/mentorship-session')
  @ApiQuery({ type: FilterMentorshipSessionsDto })
  @ApiOkResponse({ type: MentorshipSessionEntity, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching mentorship sessions: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch mentorship sessions',
    description:
      'Fetch mentorship sessions. \n\n REQUIRED ROLES: **MENTOR**, **MENTEE**, **USER** \n\n If you are a mentor, you can fetch all sessions you created. \n\n If you are a mentee, you can fetch all sessions you are matched with. \n\n If you are a user, you can fetch all sessions you are matched with.',
  })
  findAllMentorshipSessions(
    @GetUser() user: JwtPayload,
    @Query() filterMentorshipSessionsDto: FilterMentorshipSessionsDto,
  ) {
    return this.mentorshipSessionsService.findAllMentorshipSessions(
      filterMentorshipSessionsDto,
      user.sub,
    );
  }

  @Roles('MENTOR', 'MENTEE', 'USER')
  @Get('/mentorship-session/:id')
  @ApiOkResponse({ type: MentorshipSessionEntity })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching mentorship sessions by ID: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch mentorship session by ID',
    description:
      'Fetch mentorship sessions by ID. \n\n REQUIRED ROLES: **MENTOR**, **MENTEE**, **USER** \n\n If you are a mentor, you can fetch all sessions you created. \n\n If you are a mentee, you can fetch all sessions you are matched with. \n\n If you are a user, you can fetch all sessions you are matched with.',
  })
  findMentorshipSessionsById(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.mentorshipSessionsService.findMentorshipSessionsById(
      +id,
      user.sub,
    );
  }

  // MENTEE NOTES
  @Roles('MENTEE')
  @Post('/mentee-notes')
  @ApiBody({ type: CreateSessionMenteeNoteDto })
  @ApiCreatedResponse({ type: MentorshipSessionMenteeNotesEntity })
  @ApiInternalServerErrorResponse({
    description:
      'Error creating mentorship session mentee notes: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create mentorship session mentee notes',
    description:
      'Create mentorship session mentee notes. \n\n REQUIRED ROLES: **MENTEE**',
  })
  @ApiBearerAuth()
  createMentorshipSessionMenteeNote(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() createSessionMenteeNoteDto: CreateSessionMenteeNoteDto,
  ) {
    return this.mentorshipSessionsService.createMentorshipSessionMenteeNote(
      +id,
      user.sub,
      createSessionMenteeNoteDto,
    );
  }

  @Roles('MENTEE')
  @Put('/mentee-notes/:id')
  @ApiBody({ type: UpdateSessionMenteeNoteDto })
  @ApiOkResponse({ type: MentorshipSessionMenteeNotesEntity })
  @ApiNotFoundResponse({
    description: 'There is no mentorship session mentee notes with ID #[:id]',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error updating mentorship session mentee notes with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update mentorship session mentee notes',
    description:
      'Update mentorship session mentee notes. \n\n REQUIRED ROLES: **MENTEE**',
  })
  @ApiBearerAuth()
  updateMentorshipSessionMenteeNote(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateSessionMenteeNoteDto: UpdateSessionMenteeNoteDto,
  ) {
    return this.mentorshipSessionsService.updateMentorshipSessionMenteeNote(
      +id,
      user.sub,
      updateSessionMenteeNoteDto,
    );
  }

  @Roles('MENTEE')
  @Delete('/mentee-notes/:id')
  @ApiOkResponse({ type: Number })
  @ApiNotFoundResponse({
    description:
      'There is no mentorship session mentee notes with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete mentorship session mentee notes',
    description:
      'Delete mentorship session mentee notes. \n\n REQUIRED ROLES: **MENTEE**',
  })
  @ApiBearerAuth()
  deleteMentorshipSessionMenteeNote(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.mentorshipSessionsService.deleteMentorshipSessionMenteeNote(
      +id,
      user.sub,
    );
  }

  @Roles('MENTEE', 'USER')
  @Get('/mentee-notes/:mentorshipSessionId')
  @ApiOkResponse({ type: MentorshipSessionMenteeNotesEntity, isArray: true })
  @ApiInternalServerErrorResponse({
    description:
      'Error fetching mentorship session mentee notes: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch mentorship session mentee notes',
    description:
      'Fetch mentorship session mentee notes. \n\n REQUIRED ROLES: **MENTEE**, **USER** \n\n If you are a mentee, you can fetch all notes for all sessions you are matched with. \n\n If you are a user, you can fetch all notes for all sessions you are matched with.',
  })
  findAllMenteeNotes(
    @GetUser() user: JwtPayload,
    @Param('mentorshipSessionId') mentorshipSessionId: string,
  ) {
    return this.mentorshipSessionsService.findAllMentorshipSessionMenteeNotes(
      +mentorshipSessionId,
      user.sub,
    );
  }

  //RATINGS (MENTOR AND MENTEE)

  @Roles('MENTOR', 'MENTEE', 'USER')
  @Post('/session-ratings')
  @ApiBody({ type: CreateSessionRatingDto })
  @ApiCreatedResponse({ type: MentorshipSessionRatingEntity })
  @ApiInternalServerErrorResponse({
    description: 'Error creating mentorship session rating: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create mentorship session rating',
    description:
      'Create mentorship session rating. \n\n Only users involved in a session can rate',
  })
  @ApiBearerAuth()
  createMentorshipSessionRating(
    @GetUser() user: JwtPayload,
    @Body() createSessionRatingDto: CreateSessionRatingDto,
  ) {
    return this.mentorshipSessionsService.createMentorshipSessionRating(
      user.sub,
      createSessionRatingDto,
    );
  }

  @Roles('ADMIN', 'MENTOR', 'MENTEE', 'USER')
  @Get('/session-ratings')
  @ApiQuery({ type: FilterMentorshipSessionRatingsDto })
  @ApiOkResponse({ type: MentorshipSessionRatingEntity, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching mentorship session rating: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch mentorship session ratings',
    description:
      'Fetch mentorship session ratings. \n\n REQUIRED ROLES: **ADMIN**, **MENTOR**, **MENTEE**, **USER** \n\n If you are a mentor, you can fetch all ratings for all sessions you created. \n\n If you are a mentee, you can fetch all ratings for all sessions you are matched with. \n\n If you are a user, you can fetch all ratings for all sessions you are matched with.',
  })
  findAllMentorshipSessionRatings(
    @GetUser() user: JwtPayload,
    @Query()
    filterMentorshipSessionRatingsDto: FilterMentorshipSessionRatingsDto,
  ) {
    return this.mentorshipSessionsService.findAllMentorshipSessionRatings(
      filterMentorshipSessionRatingsDto,
      user.sub,
    );
  }

  // MATCHING

  @Roles('ADMIN')
  @Post('/matching')
  @ApiBody({ type: CreateMatchingDto })
  @ApiCreatedResponse({ type: MatchedMentorMenteeEntity })
  @ApiInternalServerErrorResponse({
    description: 'Error matching MENTOR with MENTEE: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create matching',
    description:
      'Create matching between MENTOR and MENTEE. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  createMatching(@Body() createMatchingDto: CreateMatchingDto) {
    return this.mentorshipSessionsService.createMatching(createMatchingDto);
  }

  @Roles('MENTOR')
  @Patch('/matching/:id')
  @ApiBody({ type: UpdateMatchingDto })
  @ApiOkResponse({ type: MatchedMentorMenteeEntity })
  @ApiNotFoundResponse({
    description: 'There is no matching with ID #[:id] to update',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error updating matching with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update matching status',
    description:
      'Update the status of a match between MENTOR and MENTEE. \n\n REQUIRED ROLES: **MENTOR**',
  })
  @ApiBearerAuth()
  updateMatchingStatus(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Body() updateMatchingDto: UpdateMatchingDto,
  ) {
    return this.mentorshipSessionsService.updateMatchingStatus(
      +id,
      updateMatchingDto,
      user.sub,
    );
  }

  @Roles('ADMIN')
  @Get('/matching/mentor/:mentorId')
  @ApiOkResponse({ type: User, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching matching users: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Get match suggestions for a mentor',
    description:
      'Get match suggestions for a mentor. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  findAllMatchingForMentor(@Param('mentorId') mentorId: string) {
    return this.mentorshipSessionsService.findAllMatchingForMentor(+mentorId);
  }

  @Roles('ADMIN')
  @Get('/matching/mentee/:menteeId')
  @ApiOkResponse({ type: User, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching matching users: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Get match suggestions for a mentee',
    description:
      'Get match suggestions for a mentee. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  findAllMatchingForMentee(@Param('menteeId') menteeId: string) {
    return this.mentorshipSessionsService.findAllMatchingForMentee(+menteeId);
  }
}
