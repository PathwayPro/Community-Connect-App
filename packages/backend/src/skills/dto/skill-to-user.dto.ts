import { IsInt } from 'class-validator';

export class SkillToUserDto {
  @IsInt()
  user_id: number;
  @IsInt()
  skill_id: number;
}
