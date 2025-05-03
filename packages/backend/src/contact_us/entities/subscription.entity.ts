import { NewsletterStatus } from '@prisma/client';

export class Subscription {
  id: number;
  email: string;
  created_at: Date;
  status: NewsletterStatus;
}
