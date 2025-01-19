import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Public, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createGoalDto: CreateGoalDto) {
    const goal: CreateGoalDto = {name: createGoalDto.name};
    return this.goalsService.create(goal);
  }

  @Get()
  @Public()
  findAll() {
    return this.goalsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    const goal: UpdateGoalDto = {name: updateGoalDto.name};
    return this.goalsService.update(+id, goal);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return id;
    //return this.goalsService.remove(+id);
  }
}
