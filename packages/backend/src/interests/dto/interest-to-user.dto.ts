import { IsInt } from 'class-validator';

export class InterestToUserDto {
    @IsInt()
    user_id: number;
    @IsInt()
    interest_id: number;
}
