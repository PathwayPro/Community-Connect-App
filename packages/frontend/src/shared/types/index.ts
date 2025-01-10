import { SharedIcons } from '../components/icons';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// export interface ApiError {
//   message: string;
//   status: number;
//   errors?: Record<string, string[]>;
// }

export interface DialogState {
  isOpen: boolean;
  title: string;
  description: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
}
