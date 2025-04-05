export interface Connection {
  id: number;
  user_id: number;
  connected_user_id: number;
  created_at: Date;
}

export interface ConnectionRequest {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: Date;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  created_at: Date;
}

export interface ChatPreview {
  user_id: number;
  last_message: string;
  last_message_time: Date;
  unread_count?: number;
}

export interface ConnectionRequestResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
