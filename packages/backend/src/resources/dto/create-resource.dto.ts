import { IsEnum, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceType } from '@prisma/client';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Title for the resource',
    example: 'Title for the resource',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Resource details', example: 'Resource details' })
  @IsString()
  details: string;

  @ApiProperty({
    description: 'Type of resource [INVOICE | RESUME | BANNER]',
    example: 'RESUME',
  })
  @IsEnum(ResourceType)
  type: ResourceType;

  @IsString()
  @IsUrl()
  link: string;
}
