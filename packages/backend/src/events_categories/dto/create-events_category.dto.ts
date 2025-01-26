import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventsCategoryDto {
  @ApiProperty({
    description: 'Name for the new category',
    example: 'Workshop',
  })
  @IsString()
  name: string;
}
