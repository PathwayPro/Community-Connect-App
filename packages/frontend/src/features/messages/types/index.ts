export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  created_at: Date;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
    picture_upload_link?: string;
    role?: string;
  };
}

export type ConnectionRequestsStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'NO_REQUEST';

export interface ChatPreview {
  user_chat: number;
  last_message: Date;
  first_name: string;
  last_name: string;
  picture_upload_link: string | null;
  role?: string;
  last_message_type: 'MESSAGE' | 'CONNECTION_REQUEST';
  last_message_content: string | null;
  connection_status: ConnectionRequestsStatus | null;
}

export interface MessageBubble {
  type: 'CONNECTION_REQUEST' | string;
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  created_at: string;
  status: 'PENDING' | string;
  sender_first_name: string;
  sender_last_name: string;
  sender_picture_upload_link: string;
  sender_role: 'ADMIN' | 'MENTOR' | string;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_picture_upload_link: string;
  recipient_role: 'ADMIN' | 'MENTOR' | string;
}
