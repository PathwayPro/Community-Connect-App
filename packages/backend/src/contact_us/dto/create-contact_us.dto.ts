import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  company_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  contact_message: string;
}
