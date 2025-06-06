'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Download, FileImage, FileText, Camera, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardElementId?: string;
}

export type ExportFormat = 'jpg' | 'pdf';

export const ExportReportModal = ({
  isOpen,
  onClose,
  dashboardElementId = 'analytics-dashboard'
}: ExportReportModalProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('jpg');
  const [isExporting, setIsExporting] = useState(false);

  const captureScreenshotAlternative =
    async (): Promise<HTMLCanvasElement | null> => {
      try {
        // Alternative approach: capture the entire body and crop to dashboard
        const dashboardElement = document.getElementById(dashboardElementId);
        if (!dashboardElement) {
          toast.error('Analytics dashboard not found. Please try again.');
          return null;
        }

        // Get dashboard position
        const rect = dashboardElement.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        // Capture the full page
        const canvas = await html2canvas(document.body, {
          backgroundColor: '#ffffff',
          scale: 1.5,
          logging: false,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          imageTimeout: 30000,
          width: window.innerWidth,
          height: window.innerHeight,
          scrollX: scrollLeft,
          scrollY: scrollTop,
          ignoreElements: (element) => {
            return (
              element.getAttribute('role') === 'dialog' ||
              element.classList?.contains('modal') ||
              element.classList?.contains('overlay') ||
              element.classList?.contains('fixed')
            );
          }
        });

        // Create a new canvas with just the dashboard content
        const dashboardCanvas = document.createElement('canvas');
        const ctx = dashboardCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Set the size to match the dashboard element
        dashboardCanvas.width = rect.width * 1.5; // Match the scale
        dashboardCanvas.height = rect.height * 1.5;

        // Draw the dashboard portion from the full page capture
        ctx.drawImage(
          canvas,
          rect.left * 1.5,
          rect.top * 1.5, // Source position
          rect.width * 1.5,
          rect.height * 1.5, // Source size
          0,
          0, // Destination position
          dashboardCanvas.width,
          dashboardCanvas.height // Destination size
        );

        return dashboardCanvas;
      } catch (error) {
        console.error('Alternative capture failed:', error);
        return null;
      }
    };

  const captureScreenshot = async (): Promise<HTMLCanvasElement | null> => {
    const dashboardElement = document.getElementById(dashboardElementId);

    if (!dashboardElement) {
      toast.error('Analytics dashboard not found. Please try again.');
      return null;
    }

    try {
      // Store original scroll positions
      const originalScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const originalScrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // Scroll to the dashboard element and ensure it's fully visible
      dashboardElement.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollTo(0, 0);

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the actual rendered dimensions
      const rect = dashboardElement.getBoundingClientRect();

      // Calculate full content dimensions including any overflow
      const fullWidth = Math.max(
        dashboardElement.scrollWidth,
        dashboardElement.offsetWidth,
        rect.width
      );

      const fullHeight = Math.max(
        dashboardElement.scrollHeight,
        dashboardElement.offsetHeight,
        rect.height
      );

      console.log('Capturing dimensions:', { fullWidth, fullHeight, rect });

      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: '#ffffff',
        scale: 1.5, // Good balance between quality and performance
        logging: true, // Enable logging for debugging
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 30000,
        removeContainer: false,
        width: fullWidth,
        height: fullHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        x: 0,
        y: 0,
        // Ensure we capture everything
        onclone: (clonedDoc) => {
          // Apply styles to ensure full content is visible in the clone
          const clonedElement = clonedDoc.getElementById(dashboardElementId);
          if (clonedElement) {
            clonedElement.style.position = 'static';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.transform = 'none';
          }
        },
        // Capture the full element regardless of viewport
        ignoreElements: (element) => {
          // Skip modal and overlay elements that might interfere
          return (
            element.tagName === 'IFRAME' ||
            element.classList?.contains('fixed') ||
            element.classList?.contains('sticky') ||
            element.getAttribute('role') === 'dialog' ||
            element.classList?.contains('modal') ||
            element.classList?.contains('overlay')
          );
        }
      });

      // Restore original scroll positions
      window.scrollTo(originalScrollLeft, originalScrollTop);

      console.log('Canvas dimensions:', canvas.width, canvas.height);

      // Check if canvas seems too small (might indicate partial capture)
      if (canvas.width < 800 || canvas.height < 600) {
        console.warn('Canvas seems too small, trying alternative method...');
        const alternativeCanvas = await captureScreenshotAlternative();
        if (alternativeCanvas) {
          return alternativeCanvas;
        }
      }

      return canvas;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      console.log('Trying alternative capture method...');

      // Try alternative method as fallback
      const alternativeCanvas = await captureScreenshotAlternative();
      if (alternativeCanvas) {
        return alternativeCanvas;
      }

      toast.error('Failed to capture screenshot. Please try again.');
      return null;
    }
  };

  const generateJPG = (canvas: HTMLCanvasElement) => {
    try {
      // Convert canvas to JPG
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Create download link
      const link = document.createElement('a');
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = imgData;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Analytics report downloaded as JPG successfully!');
    } catch (error) {
      console.error('Error generating JPG:', error);
      toast.error('Failed to generate JPG. Please try again.');
    }
  };

  const generatePDF = (canvas: HTMLCanvasElement) => {
    try {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Calculate dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF in landscape orientation for better dashboard fit
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate scale to fit image in PDF while maintaining aspect ratio
      const widthRatio = pdfWidth / (imgWidth * 0.264583); // Convert pixels to mm
      const heightRatio = pdfHeight / (imgHeight * 0.264583);
      const scale = Math.min(widthRatio, heightRatio);

      const finalWidth = imgWidth * 0.264583 * scale;
      const finalHeight = imgHeight * 0.264583 * scale;

      // Center the image
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      // Add header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Dashboard Report', pdfWidth / 2, 15, {
        align: 'center'
      });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pdfWidth / 2,
        25,
        { align: 'center' }
      );

      // Add the image with some margin from header
      pdf.addImage(
        imgData,
        'JPEG',
        x,
        Math.max(y, 35),
        finalWidth,
        finalHeight
      );

      // Save the PDF
      pdf.save(
        `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`
      );

      toast.success('Analytics report downloaded as PDF successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const canvas = await captureScreenshot();

      if (!canvas) {
        return; // Error already handled in captureScreenshot
      }

      if (exportFormat === 'jpg') {
        generateJPG(canvas);
      } else {
        generatePDF(canvas);
      }

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Export Analytics Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Description */}
          <div className="rounded-lg bg-gray-50 py-4">
            <h4 className="mb-2 font-medium">Export Summary</h4>
            <p className="text-sm text-gray-600">
              This will capture a high-quality screenshot of your complete
              analytics dashboard and download it in your selected format. The
              export includes all visible charts, metrics, and data.
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <h4 className="mb-3 font-medium">Export Format</h4>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                <RadioGroupItem value="jpg" id="jpg" />
                <Label
                  htmlFor="jpg"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <FileImage className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">JPG Image</div>
                    <div className="text-sm text-gray-500">
                      High-quality image format, smaller file size
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label
                  htmlFor="pdf"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <FileText className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">PDF Document</div>
                    <div className="text-sm text-gray-500">
                      Professional format with header and date
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Export Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Current dashboard state will be captured
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Selected time period: Currently applied filter
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              High-resolution output for clarity
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="mt-4 w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="mt-4 w-full"
          >
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
