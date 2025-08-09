import { PdfPreview } from '@/shared/components/pdf/pdf-preview';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface PdfPreviewModalAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link';
  icon?: ReactNode;
  external?: boolean;
}

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  filePath: string;
  children?: ReactNode;
  actions?: PdfPreviewModalAction[];
  maxWidth?: string;
  height?: string;
  scrollAreaHeight?: string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  title = 'PDF Preview',
  description,
  filePath,
  children,
  actions = [],
  maxWidth = 'sm:min-w-[1000px]',
  height = 'sm:min-h-[800px]',
  scrollAreaHeight = 'sm:min-h-[600px]'
}: PdfPreviewModalProps) {
  const defaultActions: PdfPreviewModalAction[] = [
    {
      label: 'Close',
      onClick: onClose,
      variant: 'outline'
    }
  ];

  const modalActions = actions.length > 0 ? actions : defaultActions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn('flex h-[85dvh] flex-col p-4 sm:h-auto sm:p-6', maxWidth)}
      >
        <DialogHeader>
          <DialogTitle className="self-center text-lg font-semibold sm:text-2xl">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-sm sm:text-base">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-4 rounded-2xl bg-neutral-light-300 p-3 sm:p-4',
            height
          )}
        >
          <ScrollArea className={cn('min-h-0 flex-1', scrollAreaHeight)}>
            <PdfPreview filePath={filePath} />
          </ScrollArea>

          {children && <div className="flex flex-col gap-4">{children}</div>}
        </div>

        {modalActions.length > 0 && (
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {modalActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                asChild={!!action.href}
                className="h-11 w-full sm:h-12 sm:w-auto"
              >
                {action.href ? (
                  <a
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </a>
                ) : (
                  <>
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
