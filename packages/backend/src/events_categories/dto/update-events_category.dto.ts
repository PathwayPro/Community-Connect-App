import { PartialType } from '@nestjs/swagger';
import { CreateEventsCategoryDto } from './create-events_category.dto';

export class UpdateEventsCategoryDto extends PartialType(
  CreateEventsCategoryDto,
) {}
