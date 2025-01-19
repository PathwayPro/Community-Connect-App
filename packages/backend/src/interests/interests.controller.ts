import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { GetUser, Public, Roles } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { InterestToUserDto } from './dto/interest-to-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createInterestDto: CreateInterestDto) {
    const interest: CreateInterestDto = {name: createInterestDto.name};
    return this.interestsService.create(interest);
  }

  @Post('/user')
  @Roles('ADMIN', 'MENTOR', 'USER')
  addInterestToUser(@GetUser() user: JwtPayload, @Body('interest_id') interest_id: number) {
    const addInterest: InterestToUserDto = {
      user_id: user.sub,
      interest_id: interest_id
    };
    return this.interestsService.addInterestToUser(addInterest);
  }

  @Get()
  @Public()
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateInterestDto: UpdateInterestDto) {
    const interest: UpdateInterestDto = {name: updateInterestDto.name};
    return this.interestsService.update(+id, interest);
  }

  @Delete('/user/:interestId')
  @Roles('ADMIN', 'MENTOR', 'USER')
  removeInterestFromUser(@GetUser() user: JwtPayload, @Param('interestId') interest_id: string) {
    const removeInterest: InterestToUserDto = {
      user_id: user.sub,
      interest_id: +interest_id
    };
    return this.interestsService.removeInterestFromUser(removeInterest);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return id;
    //return this.interestsService.remove(+id);
  }
}
