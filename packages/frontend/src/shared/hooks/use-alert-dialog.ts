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
  }) => void;
  hideAlert: () => void;
}

export const useAlertDialog = create<AlertDialogState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  type: 'info',
  showAlert: ({ title, description, type = 'info' }) =>
    set({ isOpen: true, title, description, type }),
  hideAlert: () =>
    set({ isOpen: false, title: '', description: '', type: 'info' })
}));
