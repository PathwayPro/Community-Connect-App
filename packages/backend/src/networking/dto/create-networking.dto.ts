import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConnectionRequestsDto {
  @ApiProperty({ description: 'ID of the user to connect with', example: '9' })
  @IsInt()
  recipient_id: number;

  @ApiProperty({
    description: 'Optional message to send with the connection request',
    example: 'Some message to connect',
  })
  @IsString()
  @IsOptional()
  message?: string;
}

export class CreateConnectedUsersDto {
  @IsInt()
  sender_id: number;

  @IsInt()
  recipient_id: number;
}

export class CreateMessagesDto {
  @ApiProperty({
    description: 'ID of the user to send the message',
    example: '9',
  })
  @IsInt()
  recipient_id: number;

  @ApiProperty({ description: 'Message to send', example: 'Some message...' })
  @IsString()
  message?: string;
}
