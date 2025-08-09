import { ImagePreview } from '@/shared/components/image/image-preview';
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

interface ExpandedNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  newsTitle: string;
  description: string;
  articleUrl: string;
}

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return '#';
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
};

export function ExpandedNewsModal({
  isOpen,
  onClose,
  image,
  newsTitle,
  description,
  articleUrl
}: ExpandedNewsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[85dvh] w-[92vw] max-w-[95vw] flex-col p-4 sm:h-auto sm:min-w-[1000px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="self-center text-lg font-semibold sm:text-base">
            News
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is a news article
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-neutral-light-200 p-4">
          <div className="relative aspect-video h-[220px] w-full sm:h-[300px]">
            {/* <Image
              src={image || '/event/placeholder-2.jpg'}
              alt={newsTitle}
              fill
              className="rounded-2xl object-cover"
            /> */}

            <ImagePreview
              imagePath={image}
              alt={newsTitle}
              className="object-cover"
              fill={true}
              priority={true}
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>

          <h2 className="sm:text-h3 self-center text-xl font-semibold">
            {newsTitle}
          </h2>

          <ScrollArea className="h-[200px] sm:h-[250px]">
            <p className="sm:paragraph-lg text-justify text-sm font-normal">
              {description}
            </p>
          </ScrollArea>
        </div>

        <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 w-full sm:h-12 sm:w-auto"
          >
            Back to News
          </Button>
          {articleUrl && (
            <Button
              variant="default"
              asChild
              className="h-11 w-full sm:h-12 sm:w-auto"
            >
              <a
                href={ensureAbsoluteUrl(articleUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <LinkIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Read Full Article
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
