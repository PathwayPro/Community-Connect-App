import { Transform, Type } from 'class-transformer';
import {IsString,IsInt, IsBoolean, IsOptional, IsDateString} from 'class-validator';

export class FilterNewsDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    subtitle?: string;

    @IsString()
    @IsOptional()
    keywords?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean) 
    @Transform(({ value }) => value === 'true') 
    published?: boolean = true;
  
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    user_id?: number;
    
    @IsDateString()
    @IsOptional()
    date_from?: Date; // Format ISO 8601

    @IsDateString()
    @IsOptional()
    date_to?: Date; // Format ISO 8601
}
