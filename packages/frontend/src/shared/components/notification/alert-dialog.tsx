import { Icons } from '@/features/auth/components/icons';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '@/shared/components/ui/alert-dialog';

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
        className="h-[260px] min-w-[598px] rounded-[24px] bg-white dark:bg-slate-900"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <div className="flex items-center justify-center">
          <Icons.checkCircle />
        </div>
        <AlertDialogTitle className="mt-6 text-center">
          <h4>{title}</h4>
        </AlertDialogTitle>
        <AlertDialogDescription className="text-center">
          <p className="text-paragraph-lg">{description}</p>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogUI;
