import { Icons } from '@/features/auth/components/icons';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

type AlertDialogProps = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AlertDialogUI = ({
  title,
  description,
  open,
  onOpenChange
}: AlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} defaultOpen={open}>
      <AlertDialogContent
        className="min-h-[260px] min-w-[598px] rounded-[24px] bg-white dark:bg-slate-900"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <div className="flex items-center justify-center">
          <Icons.checkCircle />
        </div>
        <AlertDialogTitle className="mt-4 text-center text-[28px] font-semibold leading-tight">
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-4 text-center text-[16px] text-muted-foreground">
          {description}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-8 flex justify-center sm:justify-start">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogUI;
