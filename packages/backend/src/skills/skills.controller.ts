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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
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
import { Skill } from './entities/skill.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBody({ type: CreateSkillDto })
  @ApiCreatedResponse({ type: Skill })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the skill: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create skills record',
    description:
      'Creates skill or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(@Body() createSkillDto: CreateSkillDto) {
    const skill: CreateSkillDto = { name: createSkillDto.name };
    return this.skillsService.create(skill);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: Skill, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching skills: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch skills',
    description: 'Fetch all skills. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Skill })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching skill: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no Skill with ID #[:id]' })
  @ApiOperation({
    summary: 'Fetch skill by ID',
    description: 'Fetch one skill by ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBody({ type: UpdateSkillDto })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Skill })
  @ApiNotFoundResponse({ description: 'There is no Skill with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating skill with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update skills',
    description:
      'Update skills (only name) with ID [:id]. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    const skill: UpdateSkillDto = { name: updateSkillDto.name };
    return this.skillsService.update(+id, skill);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: Number })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Number })
  @ApiOperation({
    summary: '**[PENDING]**',
    description:
      'REMOVE SKILL OR KEEP IT "UNAVAILABLE" TO PRESERVE INFORMATION?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  remove(@Param('id') id: string) {
    return id;
    //return this.skillsService.remove(+id);
  }
}
