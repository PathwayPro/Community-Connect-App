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

// export interface ChatPreview {
//   user_chat: number;
//   last_message: Date;
//   first_name: string;
//   last_name: string;
//   last_message_type: 'MESSAGE' | 'CONNECTION_REQUEST';
//   last_message_content: string;
//   last_message_status: string;
// }

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
