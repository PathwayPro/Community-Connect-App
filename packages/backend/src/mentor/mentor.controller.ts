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
import { UpdateMentor } from './interfaces/updateMentor.interface';

@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get()
  findAll() {
    return this.mentorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorService.findOneById(+id);
  }

  @Post()
  create(@Body() createMentorDto: CreateMentorDto) {
    return this.mentorService.create(createMentorDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorDto: UpdateMentorDto) {
    const updatedMentor: UpdateMentor = {
      max_mentees: updateMentorDto.max_mentees,
      availability: updateMentorDto.availability,
      has_experience: updateMentorDto.has_experience,
      experience_details: updateMentorDto.experience_details,
    };
    return this.mentorService.update(+id, updatedMentor);
  }

  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const updatedMentor: UpdateMentor = {
      status: updateMentorDto.status,
    };
    return this.mentorService.update(+id, updatedMentor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorService.remove(+id);
  }
}
