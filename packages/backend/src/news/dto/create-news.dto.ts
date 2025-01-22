import {IsString,IsInt, IsBoolean, IsOptional} from 'class-validator';

export class CreateNewsDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    subtitle?: string;

    @IsString()
    @IsOptional()
    keywords?: string;

    @IsString()
    content: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean = false;
  
    @IsInt()
    @IsOptional()
    user_id?: number
}
