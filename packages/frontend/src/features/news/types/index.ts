export interface CreateNewsDTO {
  title: string;
  subtitle?: string;
  keywords?: string;
  content: string;
  published?: boolean;
  user_id?: number;
}
