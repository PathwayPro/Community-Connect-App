import { ApiProperty } from '@nestjs/swagger';
import { EnumRole } from '@prisma/client';
import { IsInt, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class EventsManager {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  event_id: number;

  @ApiProperty()
  @IsBoolean()
  published: boolean = false;

  @ApiProperty()
  @IsOptional()
  user?: {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    role: EnumRole;
  };

  @ApiProperty()
  @IsOptional()
  event?: {
    id: true;
    title: string;
    location: string;
    link: string;
    image: string;
    is_free: boolean;
    start_date: string;
    end_date: string;
  };
}
