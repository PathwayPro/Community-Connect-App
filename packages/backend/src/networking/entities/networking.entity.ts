import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ConnectionRequestsStatus } from '@prisma/client';

export class Networking {}

export class ConnectionRequest {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the user who sent the connection request',
    example: '9',
  })
  @IsInt()
  @IsNotEmpty()
  sender_id: number;

  @ApiProperty({
    description: 'ID of the user who gets the connection request',
    example: '8',
  })
  @IsInt()
  @IsNotEmpty()
  recipient_id: number;

  @ApiProperty({
    description: 'Message sent to connect (optional)',
    example: 'Message to connect...',
  })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({ description: 'Connection request status', example: 'PENDING' })
  @IsEnum(ConnectionRequestsStatus)
  status: ConnectionRequestsStatus;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: Date;
}

class ConnectedUsers {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @ApiProperty()
  last_name: string;
}

export class Connections {
  @ApiProperty({ description: 'Connected since this date' })
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty({ description: 'User who sent the connection request' })
  @IsNotEmpty()
  sender: ConnectedUsers;

  @ApiProperty({ description: 'User who approved the connection request' })
  @IsNotEmpty()
  recipient: ConnectedUsers;
}

export class Message {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'ID of the user who sent the message',
    example: '9',
  })
  @IsInt()
  @IsNotEmpty()
  sender_id: number;

  @ApiProperty({
    description: 'ID of the user who gets the message',
    example: '8',
  })
  @IsInt()
  @IsNotEmpty()
  recipient_id: number;

  @ApiProperty({ description: 'Message sent ', example: 'Message...' })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({ description: 'Date when the message was sent' })
  @IsNotEmpty()
  created_at: Date;
}

export class ChatList {
  @ApiProperty({ description: 'ID of the other user in the chat' })
  @IsInt()
  @IsNotEmpty()
  user_chat: number;

  @ApiProperty({ description: 'Date of the last message in this chat' })
  @IsNotEmpty()
  last_message: Date;

  @ApiProperty({ description: 'First name of the other user in the chat' })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Middle name of the other user in the chat (optional)',
  })
  @IsOptional()
  @IsString()
  middle_name?: string | null;

  @ApiProperty({ description: 'Last name of the other user in the chat' })
  @IsString()
  last_name: string;
}
