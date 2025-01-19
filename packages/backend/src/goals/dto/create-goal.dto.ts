import { IsString } from 'class-validator';

export class CreateGoalDto {
    @IsString()
      name: string;
}
