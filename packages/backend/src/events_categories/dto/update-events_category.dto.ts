import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventsCategoryDto {
  @ApiProperty({
    description: 'Name to update the category',
    example: 'WORKSHOP',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
