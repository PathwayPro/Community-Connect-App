import { Type } from 'class-transformer';
import {IsDateString, IsInt, IsOptional, IsString, IsUrl} from 'class-validator';

export class FilterResourceDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    link?: string;

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