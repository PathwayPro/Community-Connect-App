'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PDFPreviewProps {
  filePath: string;
  className?: string;
  showControls?: boolean;
  initialPage?: number;
  onDownload?: () => void;
}

export const PDFPreview = ({
  filePath,
  className,
  showControls = true,
  initialPage = 1,
  onDownload
}: PDFPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure PDF.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/${filePath}`;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try again later.');
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center p-4 text-destructive">
            {error}
          </div>
        )}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="max-w-full"
          />
        </Document>
      </div>

      {showControls && !error && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={previousPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {onDownload && (
            <Button variant="outline" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
