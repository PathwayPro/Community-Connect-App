import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
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

export class CreateCommentDto {
  @ApiPropertyOptional({
    description: 'ID of the post to comment',
    example: '1',
  })
  @IsInt()
  post_id: number;
  @ApiProperty({
    description: 'Comment text',
    example: 'This is a comment for a post...',
  })
  @IsString()
  message: string;
}

export class CreateLikeDto {
  @ApiPropertyOptional({ description: 'ID of the post to like', example: '1' })
  @IsInt()
  post_id: number;
}

export class CreateSaveDto {
  @ApiPropertyOptional({ description: 'ID of the post to save', example: '1' })
  @IsInt()
  post_id: number;
}
