import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  last_name: string;

  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ description: 'Hashed password' })
  @IsString()
  password_hash: string;

  @Column({ type: 'date', nullable: true })
  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiPropertyOptional({ description: 'Show date of birth', example: false })
  @IsBoolean()
  show_dob: boolean;

  @Column({ type: 'date', nullable: true })
  @ApiPropertyOptional({
    description: 'Arrival date in Canada',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDate()
  arrival_in_canada?: Date;

  @Column({ type: 'int', nullable: true })
  @ApiPropertyOptional({ description: 'Goal ID', example: 1 })
  @IsOptional()
  @IsInt()
  goal_id?: number;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN', 'MENTOR'],
    default: 'USER',
    nullable: false,
  })
  @ApiProperty({
    description: 'User role',
    enum: ['USER', 'ADMIN', 'MENTOR'],
    example: 'USER',
  })
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role: 'USER' | 'ADMIN' | 'MENTOR';

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Email verification token' })
  @IsOptional()
  @IsString()
  verification_token?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiPropertyOptional({
    description: 'Email verification status',
    example: false,
  })
  @IsBoolean()
  email_verified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Refresh token' })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  @Column({ type: 'date', nullable: true })
  @ApiPropertyOptional({ description: 'Last logout date' })
  @IsOptional()
  @IsDate()
  last_logout?: Date;

  @Column({ type: 'date', nullable: true })
  @ApiPropertyOptional({ description: 'Last login date' })
  @IsOptional()
  @IsDate()
  last_login?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'User status', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    description: 'Authentication provider',
    example: 'email',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiPropertyOptional({
    description: 'Account deletion status',
    example: false,
  })
  @IsBoolean()
  deleted_at?: boolean;

  @CreateDateColumn()
  @ApiPropertyOptional({ description: 'Account creation date' })
  @IsOptional()
  @IsDate()
  created_at?: Date;

  @UpdateDateColumn()
  @ApiPropertyOptional({ description: 'Last update date' })
  @IsOptional()
  @IsDate()
  updated_at?: Date;

  // Additional profile fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Province', example: 'Ontario' })
  @IsOptional()
  @IsString()
  province?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'City', example: 'Toronto' })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Languages', example: 'English, French' })
  @IsOptional()
  @IsString()
  languages?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Experience', example: '5 years' })
  @IsOptional()
  @IsString()
  experience?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    description: 'Bio',
    example: 'Experienced software engineer...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  picture_upload_link?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'Resume URL' })
  @IsOptional()
  @IsString()
  resume_upload_link?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsString()
  linkedin_link?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'GitHub URL' })
  @IsOptional()
  @IsString()
  github_link?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'Twitter URL' })
  @IsOptional()
  @IsString()
  twitter_link?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: 'Portfolio URL' })
  @IsOptional()
  @IsString()
  portfolio_link?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Other links' })
  @IsOptional()
  @IsString()
  other_links?: string;

  @Column({ type: 'json', nullable: true })
  @ApiPropertyOptional({ description: 'Additional links', type: [String] })
  @IsOptional()
  additional_links?: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Work status', example: 'Employed' })
  @IsOptional()
  @IsString()
  work_status?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Company name', example: 'Tech Corp' })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Country of origin', example: 'Canada' })
  @IsOptional()
  @IsString()
  country_of_origin?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiPropertyOptional({
    description: 'Actively searching for opportunities',
    example: false,
  })
  @IsBoolean()
  actively_searching?: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ description: 'Age range', example: '25-35' })
  @IsOptional()
  @IsString()
  age_range?: string;
}

export class UserResponseMin {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  first_name: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  last_name: string;
}
