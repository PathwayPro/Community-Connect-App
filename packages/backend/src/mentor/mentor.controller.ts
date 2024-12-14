import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { FilterMentorDto } from './dto/filter-mentor.dto';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get()
  findAll(@Body() filters: FilterMentorDto) {
    console.log('FILTERS CONTROLLER:', filters);
    return this.mentorService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorService.findOneById(+id);
  }

  @Post()
  create(@Body() createMentorDto: CreateMentorDto) {
    const createMentor: CreateMentorDto = {
      max_mentees: createMentorDto.max_mentees,
      availability: createMentorDto.availability,
      has_experience: createMentorDto.has_experience,
      experience_details: createMentorDto.experience_details,
      user_id: createMentorDto.user_id,
    };
    return this.mentorService.create(createMentor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorDto: UpdateMentorDto) {
    const updatedMentor: UpdateMentorDto = {
      max_mentees: updateMentorDto.max_mentees,
      availability: updateMentorDto.availability,
      has_experience: updateMentorDto.has_experience,
      experience_details: updateMentorDto.experience_details,
    };
    return this.mentorService.update(+id, updatedMentor);
  }

  @Put(':id')
  updateStatus(
    @Param('id') userId: string,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const updatedMentor: UpdateMentorDto = {
      status: updateMentorDto.status,
    };
    return this.mentorService.updateStatus(+userId, updatedMentor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorService.remove(+id);
  }
}
