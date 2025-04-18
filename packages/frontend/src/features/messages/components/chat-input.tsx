import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { SmileIcon, PaperclipIcon, Send, X } from 'lucide-react';
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';

interface ImagePreview {
  url: string;
  file: File;
}

export const ChatInput = () => {
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImagePreview({
        url: URL.createObjectURL(file),
        file
      });
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleConfirmImage = () => {
    // Here you would handle sending the image
    console.log('Sending image:', imagePreview?.file);
    setImagePreview(null);
  };

  return (
    <div className="border-t p-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      <div className="relative flex items-center gap-2">
        <Input placeholder="Type something..." className="flex-1" />
        <div className="absolute right-0 flex items-center gap-2 pr-2">
          <Button size="icon" variant="ghost">
            <SmileIcon className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview.url}
                alt="Preview"
                className="w-full rounded-lg object-contain"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}
          <DialogFooter className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setImagePreview(null)}
              className="h-10 w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmImage}
              className="flex h-10 w-full items-center justify-center gap-2"
            >
              Send Image
              <Send className="h-5 w-5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
