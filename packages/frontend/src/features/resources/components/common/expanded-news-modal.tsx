import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ExpandedNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  newsTitle: string;
  description: string;
  articleUrl: string;
}

export function ExpandedNewsModal({
  isOpen,
  onClose,
  imageUrl,
  newsTitle,
  description,
  articleUrl
}: ExpandedNewsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="self-center">
            <h4 className="font-semibold">News</h4>
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is a news article
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-2xl bg-neutral-light-200 p-4">
          <div className="relative aspect-video h-[300px] w-full">
            <Image
              src={imageUrl}
              alt={newsTitle}
              fill
              className="rounded-2xl object-cover"
            />
          </div>

          <h3 className="text-h3 self-center font-semibold">{newsTitle}</h3>

          <ScrollArea className="h-[250px]">
            <p className="paragraph-lg text-justify font-normal">
              {description}
            </p>
          </ScrollArea>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={onClose} className="h-12 w-full">
            Back to News
          </Button>
          <Button
            variant="default"
            onClick={() => window.open(articleUrl, '_blank')}
            className="h-12 w-full"
          >
            <LinkIcon className="mr-2 h-6 w-6" />
            Read Full Article
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
