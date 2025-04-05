// DTOs and Types for Connections
export interface CreateConnectionRequestDto {
  recipient_id: number;
  message: string;
}

export interface UpdateConnectionRequestDto {
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
}

export interface FilterConnectionRequestDto {
  user_id?: number;
  status?: string;
  date_from?: Date | null;
  date_to?: Date | null;
}

export interface CreateMessageDto {
  recipient_id: number;
  message: string;
}
