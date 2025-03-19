import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class Goal {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Title for the goal',
    example: 'Networking',
  })
  @IsString()
  name: string;
}
