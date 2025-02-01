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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Public, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Goal } from './entities/goal.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBody({ type: CreateGoalDto })
  @ApiCreatedResponse({ type: Goal })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the goal: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create goal record',
    description:
      'Creates goal or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(@Body() createGoalDto: CreateGoalDto) {
    const goal: CreateGoalDto = { name: createGoalDto.name };
    return this.goalsService.create(goal);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: Goal, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching goals: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch goals',
    description: 'Fetch all goals. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAll() {
    return this.goalsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Goal })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching goal: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no Goal with ID #[:id]' })
  @ApiOperation({
    summary: 'Fetch goal by ID',
    description: 'Fetch one goal by ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBody({ type: UpdateGoalDto })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Goal })
  @ApiNotFoundResponse({ description: 'There is no Goal with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating goal with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update goals',
    description:
      'Update goals (only name) with ID [:id]. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    const goal: UpdateGoalDto = { name: updateGoalDto.name };
    return this.goalsService.update(+id, goal);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: Number })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Number })
  @ApiOperation({
    summary: '**[PENDING]**',
    description:
      'REMOVE GOAL OR KEEP IT "UNAVAILABLE" TO PRESERVE INFORMATION?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  remove(@Param('id') id: string) {
    return id;
    //return this.goalsService.remove(+id);
  }
}
