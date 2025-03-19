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
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
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
import { Interest } from './entities/interest.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBody({ type: CreateInterestDto })
  @ApiCreatedResponse({ type: Interest })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the interest: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create interests record',
    description:
      'Creates interest or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  create(@Body() createInterestDto: CreateInterestDto) {
    const interest: CreateInterestDto = { name: createInterestDto.name };
    return this.interestsService.create(interest);
  }

  /*
  NO NEED FOR THIS ONE, WILL BE INTEGRATED IN USERS AND MENTORS
  @Post('/user')
  @Roles('ADMIN', 'MENTOR', 'USER')
  addInterestToUser(@GetUser() user: JwtPayload, @Body('interest_id') interest_id: number) {
    const addInterest: InterestToUserDto = {
      user_id: user.sub,
      interest_id: interest_id
    };
    return this.interestsService.addInterestToUser(addInterest);
  }
  */

  @Get()
  @Public()
  @ApiOkResponse({ type: Interest, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching interests: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch interests',
    description: 'Fetch all interests. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Interest })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching interest: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no Interest with ID #[:id]' })
  @ApiOperation({
    summary: 'Fetch interest by ID',
    description: 'Fetch one interest by ID. \n\n REQUIRED ROLES: **PUBLIC**',
  })
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBody({ type: UpdateInterestDto })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Interest })
  @ApiNotFoundResponse({ description: 'There is no Interest with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating interest with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update interests',
    description:
      'Update interests (only name) with ID [:id]. \n\n REQUIRED ROLES: **ADMIN**',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    const interest: UpdateInterestDto = { name: updateInterestDto.name };
    return this.interestsService.update(+id, interest);
  }

  /*
  NO NEED FOR THIS ONE, WILL BE INTEGRATED IN USERS AND MENTORS
  @Delete('/user/:interestId')
  @Roles('ADMIN', 'MENTOR', 'USER')
  removeInterestFromUser(@GetUser() user: JwtPayload, @Param('interestId') interest_id: string) {
    const removeInterest: InterestToUserDto = {
      user_id: user.sub,
      interest_id: +interest_id
    };
    return this.interestsService.removeInterestFromUser(removeInterest);
  }
*/

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: Number })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Number })
  @ApiOperation({
    summary: '**[PENDING]**',
    description:
      'REMOVE INTEREST OR KEEP IT "UNAVAILABLE" TO PRESERVE INFORMATION?. \n\n REQUIRED ROLES: **ADMIN**',
  })
  remove(@Param('id') id: string) {
    return id;
    //return this.interestsService.remove(+id);
  }
}
