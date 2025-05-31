import { IsEnum, IsString, IsUrl, IsOptional } from 'class-validator';
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
    description:
      'Type of resource [RESUME | COVER_LETTER | LINKEDIN | BUSINESS_CARD | EMAIL_SIGNATURE | PORTFOLIO | PERSONAL_BRANDING | JOB_APPLICATION_TRACKER | INTERVIEW_PREP | NETWORKING_TIPS | CAREER_PLANNING | SALARY_NEGOTIATION | INVOICE | BANNER | OTHER]',
    example: 'RESUME',
  })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({
    description: 'URL link for the resource',
    example: 'https://example.com/resource',
  })
  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty({ description: 'File for the resource', required: false })
  @IsOptional()
  file?: Express.Multer.File;
}
