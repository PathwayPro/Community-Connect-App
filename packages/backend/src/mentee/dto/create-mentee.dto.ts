import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenteeDto {
  @ApiPropertyOptional({ description: 'Reason to be mentored' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Array of interests IDs to match with mentors (Number[])',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value).map((item: any) => parseInt(item, 10));
    } else if (Array.isArray(value)) {
      return value.map((item: any) => parseInt(item, 10));
    } else {
      return [];
    }
  })
  interests?: number[];
}
