import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { SmileIcon, PaperclipIcon, Send } from 'lucide-react';
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { useMessageStore } from '../store';
import { ConnectionRequestsStatus } from '../types';
import Image from 'next/image';
interface ImagePreview {
  url: string;
  file: File;
}

interface ChatInputProps {
  recipientId: number;
  connectionStatus: ConnectionRequestsStatus;
  lastMessageType: 'MESSAGE' | 'CONNECTION_REQUEST';
}

export const ChatInput = ({
  recipientId,
  connectionStatus,
  lastMessageType
}: ChatInputProps) => {
  const { sendMessage } = useMessageStore();
  const [messageInputs, setMessageInputs] = useState<Record<number, string>>(
    {}
  );
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDisabled =
    connectionStatus !== 'APPROVED' && lastMessageType !== 'MESSAGE';

  const currentMessage = messageInputs[recipientId] || '';

  const handleMessageChange = (value: string) => {
    setMessageInputs((prev) => ({
      ...prev,
      [recipientId]: value
    }));
  };

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

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage({
        message: currentMessage,
        recipient_id: recipientId
      });
      // Clear only the current recipient's message
      setMessageInputs((prev) => ({
        ...prev,
        [recipientId]: ''
      }));
    }
  };

  return (
    <div className="border-t p-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
        disabled={isDisabled}
      />

      <div className="relative flex items-center gap-2">
        <Input
          placeholder={
            isDisabled
              ? "Can't send messages until connection is approved"
              : 'Type something...'
          }
          className="flex-1"
          value={currentMessage}
          onChange={(e) => handleMessageChange(e.target.value)}
          disabled={isDisabled}
        />
        <div className="absolute right-0 flex items-center gap-2 pr-2">
          <Button size="icon" variant="ghost" disabled={isDisabled}>
            <SmileIcon className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleSendMessage} disabled={isDisabled}>
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
              <Image
                src={imagePreview.url}
                alt="Preview"
                className="w-full rounded-lg object-contain"
                width={400}
                height={300}
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
