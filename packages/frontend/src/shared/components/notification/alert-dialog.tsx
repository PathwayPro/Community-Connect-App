import { Icons } from '@/features/auth/components/icons';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { cn } from '@/shared/lib/utils';
import { useEffect } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

const iconMap = {
  success: <Icons.checkCircle className="h-12 w-12 text-success-500" />,
  error: <Icons.xCircle className="h-12 w-12 text-error-500" />,
  warning: <Icons.alertTriangle className="h-12 w-12 text-warning-500" />,
  info: <Icons.informationCircle className="text-info-500 h-12 w-12" />
};

export function AlertDialogUI() {
  const { isOpen, title, description, type, hideAlert, redirect } =
    useAlertDialog();

  useEffect(() => {
    if (isOpen && type) {
      const timer = setTimeout(() => {
        if (redirect) {
          window.location.href = redirect;
        }
        hideAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, type, hideAlert, redirect]);

  const handleClose = () => {
    if (redirect) {
      window.location.href = redirect;
    }
    hideAlert();
  };

  // Only render when we have both isOpen and a type
  if (!isOpen || !type) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={hideAlert}>
      <AlertDialogContent
        className="min-h-[260px] min-w-[598px] rounded-[24px] bg-white dark:bg-slate-900"
        onEscapeKeyDown={hideAlert}
      >
        <div className="flex items-center justify-center">
          {iconMap[type as AlertType]}
        </div>
        <AlertDialogTitle
          className={cn(
            'mt-4 text-center text-[28px] font-semibold leading-tight',
            type === 'error' && 'text-error-600',
            type === 'success' && 'text-success-600',
            type === 'warning' && 'text-warning-600'
          )}
        >
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-4 text-center text-[16px] text-muted-foreground">
          {description}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-8 flex justify-center sm:justify-start">
          <Button variant="outline" onClick={handleClose} className="w-full">
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
