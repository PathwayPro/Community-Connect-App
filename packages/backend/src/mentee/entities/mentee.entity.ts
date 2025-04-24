import { IsInt, IsString, IsEnum } from 'class-validator';
import { mentees_status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Mentees {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  resume: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsEnum(mentees_status)
  status: mentees_status = 'PENDING';

  @ApiProperty()
  @IsInt()
  user_id: number;
}
