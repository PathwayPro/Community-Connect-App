import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  removeImage?: boolean;
}
