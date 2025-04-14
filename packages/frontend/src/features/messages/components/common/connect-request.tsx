import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  connectRequestSchema,
  ConnectRequestForm
} from '../../lib/validations/connect-request';

interface ConnectRequestProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (message: string) => void;
}

export function ConnectRequest({
  isOpen = false,
  onClose,
  onSubmit
}: ConnectRequestProps) {
  const form = useForm<ConnectRequestForm>({
    resolver: zodResolver(connectRequestSchema),
    defaultValues: {
      message: ''
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit?.(data.message);
    form.reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
          <DialogDescription>
            Send a brief message introducing yourself and explaining why
            you&apos;d like to connect. A personalized message increases the
            likelihood of your request being accepted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Textarea
                {...form.register('message')}
                placeholder="Hello! I'd like to connect with you because..."
                className="min-h-[120px]"
              />
              {form.formState.errors.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.message.message}
                </p>
              )}
              <p className="text-right text-sm text-muted-foreground">
                {form.watch('message').length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="h-10"
            >
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
