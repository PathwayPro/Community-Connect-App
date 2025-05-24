import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { users_roles } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiPropertyOptional({
    enum: users_roles,
    description: 'New user role',
  })
  @IsEnum(users_roles)
  role: users_roles;
}

export class UpdateUserStatusDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'User account status (true = active, false = inactive)',
  })
  isActive: boolean;
}

export class ResetUserPasswordDto {
  @ApiPropertyOptional({
    type: String,
    description: 'New password for the user',
  })
  @IsString()
  password: string;
}

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    type: Number,
    default: 1,
    description: 'Page number',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    default: 10,
    description: 'Number of items per page',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    type: String,
    description: 'Search term for user name or email',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: users_roles,
    description: 'Filter by role',
  })
  @IsEnum(users_roles)
  @IsOptional()
  role?: users_roles;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  isActive?: boolean;
}
