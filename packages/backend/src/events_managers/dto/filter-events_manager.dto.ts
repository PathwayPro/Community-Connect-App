import { PartialType } from '@nestjs/swagger';
import { CreateEventsManagerDto } from './create-events_manager.dto';

export class FilterEventsManagerDto extends PartialType(
  CreateEventsManagerDto,
) {}
