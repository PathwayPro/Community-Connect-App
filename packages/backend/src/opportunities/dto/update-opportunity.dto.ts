import { PartialType } from '@nestjs/swagger';
import { CreateOpportunityDto } from './create-opportunity.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {
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
