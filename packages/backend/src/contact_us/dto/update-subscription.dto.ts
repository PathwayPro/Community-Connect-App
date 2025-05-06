import { IsEmail } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsEmail()
  email: string;
}
