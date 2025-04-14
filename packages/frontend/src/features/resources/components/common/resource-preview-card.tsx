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

interface ResourcePreviewCardProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  details: string;
  link: string;
  type: string;
}

export function ResourcePreviewCard({
  isOpen,
  onClose,
  image,
  title,
  details,
  link,
  type
}: ResourcePreviewCardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="self-center text-base font-semibold">
            Resource Preview
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is a resource preview
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[688px] flex-col gap-4 rounded-2xl bg-neutral-light-300 p-4">
          <ScrollArea className="h-[500px]">
            {/* <div className="relative aspect-video h-[500px] w-full"> */}
            <Image
              src={image || '/event/placeholder-2.jpg'}
              alt={title}
              fill
              className="h-full w-[350px] rounded-2xl"
            />
            {/* </div> */}
          </ScrollArea>
          <h2 className="text-h3 font-semibold">{title}</h2>

          <p className="paragraph-lg text-justify font-normal">{details}</p>

          <p className="paragraph-lg text-justify font-normal">
            File Type: {type}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={onClose} className="h-12 w-full">
            Back to Resources
          </Button>
          <Button variant="default" asChild className="h-12 w-full">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <LinkIcon className="mr-2 h-6 w-6" />
              Get Resource
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
