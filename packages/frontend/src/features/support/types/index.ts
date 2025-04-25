export enum ContactUsStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

export interface ContactUsResponse {
  id: number;
  first_name: string;
  last_name?: string;
  company_name?: string;
  email: string;
  phone?: string;
  contact_message: string;
  status: ContactUsStatus;
  created_at: Date;
}
