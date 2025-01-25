import { ConnectionRequestsStatus } from "@prisma/client";
import { IsInt, IsOptional, IsString } from "class-validator"

export class CreateConnectionRequestsDto {
    @IsInt()
    @IsOptional()
    sender_id: number;

    @IsInt()
    recipient_id: number;
    
    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    status: ConnectionRequestsStatus = 'PENDING';
}

export class CreateConnectedUsersDto {
    @IsInt()
    sender_id: number;

    @IsInt()
    recipient_id: number;
}

export class CreateMessagesDto {
    @IsInt()
    sender_id: number;

    @IsInt()
    recipient_id: number;

    @IsString()
    message?: string;
}
