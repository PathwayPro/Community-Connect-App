import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class Interest {
  @ApiProperty({
    description: 'Name for the interest',
    example: 'Networking',
  })
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
