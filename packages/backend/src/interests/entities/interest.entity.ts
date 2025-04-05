import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class Interest {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Name for the interest',
    example: 'Networking',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
