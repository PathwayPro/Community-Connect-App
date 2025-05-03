import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class Skill {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Name for the skill',
    example: 'React',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
