import {IsString, IsUrl} from 'class-validator';

export class CreateResourceDto {
    @IsString()
    title: string;

    @IsUrl()
    link: string;
}