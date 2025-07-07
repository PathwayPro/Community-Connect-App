import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

interface EditThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (content: string) => void;
  initialContent: string;
  loading: boolean;
}

export const EditThreadModal: React.FC<EditThreadModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialContent,
  loading
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isOpen]);

  const handleUpdate = () => {
    onUpdate(content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Thread</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Edit the content of your thread.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          className="min-h-[120px] w-full rounded border p-2 text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading || !content.trim()}
            className="h-10"
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
