import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({
    description: 'Title for the goal',
    example: 'Networking',
  })
  @IsString()
  name: string;
}
