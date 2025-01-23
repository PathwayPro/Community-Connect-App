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
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { FilterMentorDto } from './dto/filter-mentor.dto';
import { GetUser, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get()
  @Roles('ADMIN')
  findAll(@Body() filters: FilterMentorDto) {
    return this.mentorService.findAll(filters);
  }

  @Get('my-application')
  @Roles('USER', 'MENTOR', 'ADMIN')
  findMyApplication(@GetUser() user: JwtPayload) {
    return this.mentorService.findOneByUserId(user.sub);
  }

  @Get(':mentorApplicationId')
  @Roles('ADMIN')
  findOne(@Param('mentorApplicationId') mentorApplicationId: string) {
    return this.mentorService.findOneById(+mentorApplicationId);
  }

  @Post()
  @Roles('USER', 'MENTOR', 'ADMIN')
  create(
    @GetUser() user: JwtPayload,
    @Body() createMentorDto: CreateMentorDto,
  ) {
    const createMentor: CreateMentorDto = {
      max_mentees: createMentorDto.max_mentees,
      availability: createMentorDto.availability,
      has_experience: createMentorDto.has_experience,
      experience_details: createMentorDto.experience_details,
      interests: createMentorDto.interests,
    };
    return this.mentorService.create(user.sub, createMentor);
  }

  @Patch()
  @Roles('USER', 'MENTOR', 'ADMIN')
  update(
    @GetUser() user: JwtPayload,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const updatedMentor: UpdateMentorDto = {
      max_mentees: updateMentorDto.max_mentees,
      availability: updateMentorDto.availability,
      has_experience: updateMentorDto.has_experience,
      experience_details: updateMentorDto.experience_details,
    };
    return this.mentorService.update(+user.sub, updatedMentor);
  }

  @Put(':mentorApplicationId')
  @Roles('ADMIN')
  updateStatus(
    @Param('mentorApplicationId') mentorApplicationId: string,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const updatedMentor: UpdateMentorDto = {
      status: updateMentorDto.status,
    };
    return this.mentorService.updateStatus(+mentorApplicationId, updatedMentor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorService.remove(+id);
  }
}
