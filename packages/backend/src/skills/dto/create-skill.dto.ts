import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Name for the skill',
    example: 'React',
  })
  @IsString()
  name: string;
}
