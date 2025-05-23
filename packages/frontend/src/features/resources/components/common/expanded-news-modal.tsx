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
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="self-center text-base font-semibold">
            News
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is a news article
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-2xl bg-neutral-light-200 p-4">
          <div className="relative aspect-video h-[300px] w-full">
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

          <h2 className="text-h3 self-center font-semibold">{newsTitle}</h2>

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
          {articleUrl && (
            <Button variant="default" asChild className="h-12 w-full">
              <a
                href={ensureAbsoluteUrl(articleUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <LinkIcon className="mr-2 h-6 w-6" />
                Read Full Article
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
