export interface ContactUsDto {
  first_name: string;
  last_name?: string;
  company_name?: string;
  email: string;
  phone?: string;
  contact_message: string;
}

export interface CreateSubscriptionDto {
  email: string;
}

export interface UpdateSubscriptionDto {
  email: string;
}
