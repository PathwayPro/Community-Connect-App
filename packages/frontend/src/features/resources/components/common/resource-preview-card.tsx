import { PDFPreview } from '@/shared/components/pdf/pdf-preview';
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

interface ResourcePreviewCardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: string;
  link: string;
  type: string;
  file: string;
}

export function ResourcePreviewCard({
  isOpen,
  onClose,
  title,
  details,
  link,
  type,
  file
}: ResourcePreviewCardProps) {
  console.log('file in preview card: ', file);

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
            <PDFPreview
              filePath={file}
              showControls={true}
              onDownload={() => {
                // Optional: handle download
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/files/${file}`,
                  '_blank'
                );
              }}
            />
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
