import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserResponseMin } from 'src/users/entities';

export class Blog {}

export class PostEntity {
  @ApiProperty({ description: 'ID of the post', example: '1' })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Content of the post...',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Image URL (optional)',
    example: 'https://image-url.com',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-02-22T21:14:07.456Z',
  })
  @IsDateString()
  created_at: string;

  @ApiPropertyOptional({
    description: 'If the post is already approved or not',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ description: 'Author user' })
  @IsObject()
  user: UserResponseMin;

  @ApiPropertyOptional({
    description: 'Total likes for the post',
    example: '10',
  })
  @IsOptional()
  @IsInt()
  likes_count: number;

  @ApiPropertyOptional({
    description: 'Total comments for the post',
    example: '10',
  })
  @IsOptional()
  @IsInt()
  comments_count: number;
}

export class PostResponseMin {
  @ApiProperty({ description: 'ID of the post', example: '1' })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Content of the post...',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-02-22T21:14:07.456Z',
  })
  @IsDateString()
  created_at: string;

  @ApiPropertyOptional({
    description: 'If the post is already approved or not',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ description: 'Author user' })
  @IsObject()
  user: UserResponseMin;
}

export class Comment {
  @ApiProperty({ description: 'ID of the comment', example: '1' })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'Content of the comment...',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-02-22T21:14:07.456Z',
  })
  @IsDateString()
  created_at: string;

  @ApiPropertyOptional({
    description: 'If the comment is already approved or not',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ description: 'Author user' })
  @IsObject()
  user: UserResponseMin;

  @ApiProperty({ description: 'Post' })
  @IsObject()
  post: PostResponseMin;
}

export class Like {
  @ApiProperty({ description: 'ID of the like', example: '1' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ID of the post liked', example: '1' })
  @IsInt()
  post_id: number;

  @ApiProperty({ description: 'ID of the user', example: '1' })
  @IsInt()
  user_id: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-02-22T21:14:07.456Z',
  })
  @IsDateString()
  created_at: string;
}

export class Save {
  @ApiProperty({ description: 'ID of the save', example: '1' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ID of the post saved', example: '1' })
  @IsInt()
  post_id: number;

  @ApiProperty({ description: 'ID of the user', example: '1' })
  @IsInt()
  user_id: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-02-22T21:14:07.456Z',
  })
  @IsDateString()
  created_at: string;
}
