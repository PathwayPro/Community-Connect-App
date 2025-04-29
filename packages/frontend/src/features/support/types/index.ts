export enum ContactUsStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

export enum NewsletterStatus {
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED'
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

export interface Subscription {
  id: number;
  email: string;
  status: NewsletterStatus;
  created_at: Date;
}
