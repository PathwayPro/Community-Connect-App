import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: 'Post text', example: 'This is a post...' })
  @IsString()
  message: string;
  @ApiProperty({
    description:
      'Uploaded file. Will use validation for posts (OPTIONAL). The image link will be stored as the post image.',
  })
  @IsOptional()
  file?: Express.Multer.File;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'This is a comment for a post...',
  })
  @IsString()
  message: string;
}
