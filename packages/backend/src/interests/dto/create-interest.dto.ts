import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({
    description: 'Name for the interest',
    example: 'Networking',
  })
  @IsString()
  name: string;
}
