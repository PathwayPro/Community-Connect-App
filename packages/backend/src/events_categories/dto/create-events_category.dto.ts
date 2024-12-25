import { IsString } from 'class-validator';

export class CreateEventsCategoryDto {
  @IsString()
  name: string;
}
