import { PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  removeFile?: boolean;
}
