import { create } from 'zustand';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  showAlert: (params: {
    title: string;
    description: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    redirect?: string;
  }) => void;
  hideAlert: () => void;
  redirect?: string;
}

export const useAlertDialog = create<AlertDialogState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  type: 'info',
  redirect: '',
  showAlert: ({ title, description, type = 'info', redirect }) =>
    set({ isOpen: true, title, description, type, redirect }),
  hideAlert: () =>
    set({
      isOpen: false,
      title: '',
      description: '',
      type: 'info',
      redirect: ''
    })
}));
