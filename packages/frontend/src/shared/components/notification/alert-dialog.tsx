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

const iconMap = {
  success: <Icons.checkCircle className="h-12 w-12 text-success-500" />,
  error: <Icons.xCircle className="h-12 w-12 text-error-500" />,
  warning: <Icons.alertTriangle className="h-12 w-12 text-warning-500" />,
  info: <Icons.informationCircle className="text-info-500 h-12 w-12" />
};

export function AlertDialogUI() {
  const {
    isOpen,
    title,
    description,
    type = 'info',
    hideAlert
  } = useAlertDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={hideAlert}>
      <AlertDialogContent
        className="min-h-[260px] min-w-[598px] rounded-[24px] bg-white dark:bg-slate-900"
        onEscapeKeyDown={hideAlert}
      >
        <div className="flex items-center justify-center">{iconMap[type]}</div>
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
          <Button variant="outline" onClick={hideAlert} className="w-full">
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
