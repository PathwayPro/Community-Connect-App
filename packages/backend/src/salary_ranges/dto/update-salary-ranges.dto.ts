import { PartialType } from '@nestjs/swagger';
import { CreateSalaryRangeDto } from './create-salary-ranges.dto';

export class UpdateSalaryRangeDto extends PartialType(CreateSalaryRangeDto) {}
