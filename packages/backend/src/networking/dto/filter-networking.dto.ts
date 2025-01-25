import { ConnectionRequestsStatus } from "@prisma/client";
import { IsDateString, IsInt, IsOptional, IsString } from "class-validator"

export class FilterConnectionRequestsDto {
    @IsString()
    @IsOptional()
    user_id?: string; // ID of the other user, not the logged one
    
    @IsString()
    @IsOptional()
    status?: ConnectionRequestsStatus;

    @IsDateString()
    @IsOptional()
    date_from?: Date; // Format ISO 8601

    @IsDateString()
    @IsOptional()
    date_to?: Date; // Format ISO 8601
}

export class FilterConnectedUsersDto {}

export class FilterMessagesDto {}
