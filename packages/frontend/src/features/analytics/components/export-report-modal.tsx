'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import {
  Download,
  FileImage,
  FileText,
  FileSpreadsheet,
  Camera,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useAdminStore } from '@/features/admin/store/admin-store';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardElementId?: string;
}

export type ExportFormat = 'jpg' | 'pdf' | 'xls';

export const ExportReportModal = ({
  isOpen,
  onClose,
  dashboardElementId = 'analytics-dashboard'
}: ExportReportModalProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('jpg');
  const [isExporting, setIsExporting] = useState(false);

  const {
    overviewMetrics,
    newUsersData,
    userDistribution,
    userActivityData,
    selectedPeriod
  } = useAdminStore();

  const captureScreenshot = async (): Promise<HTMLCanvasElement | null> => {
    const dashboardElement = document.getElementById(dashboardElementId);

    if (!dashboardElement) {
      toast.error('Analytics dashboard not found. Please try again.');
      return null;
    }

    try {
      // Store original scroll positions and body styles
      const originalScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const originalScrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyHeight = document.body.style.height;

      // Temporarily modify body to allow full content rendering
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';

      // Scroll to top to ensure we start from the beginning
      window.scrollTo(0, 0);

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the dashboard element's full dimensions
      const dashboardRect = dashboardElement.getBoundingClientRect();
      const dashboardScrollHeight = dashboardElement.scrollHeight;
      const dashboardScrollWidth = dashboardElement.scrollWidth;
      const dashboardOffsetHeight = dashboardElement.offsetHeight;
      const dashboardOffsetWidth = dashboardElement.offsetWidth;

      // Calculate the actual full dimensions of the dashboard content
      const fullWidth = Math.max(
        dashboardScrollWidth,
        dashboardOffsetWidth,
        dashboardRect.width,
        dashboardElement.scrollWidth
      );

      const fullHeight = Math.max(
        dashboardScrollHeight,
        dashboardOffsetHeight,
        dashboardRect.height,
        dashboardElement.scrollHeight
      );

      console.log('Dashboard dimensions:', {
        fullWidth,
        fullHeight,
        rect: dashboardRect,
        scrollHeight: dashboardScrollHeight,
        scrollWidth: dashboardScrollWidth,
        offsetHeight: dashboardOffsetHeight,
        offsetWidth: dashboardOffsetWidth
      });

      // Use html2canvas with improved settings for full content capture
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 30000,
        removeContainer: false,
        width: fullWidth,
        height: fullHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        x: 0,
        y: 0,
        // Enhanced clone handling
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(dashboardElementId);
          if (clonedElement) {
            // Ensure the cloned element shows all content
            clonedElement.style.position = 'static';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '100%';
            clonedElement.style.display = 'block';

            // Remove any max-height constraints from child elements
            const childElements = clonedElement.querySelectorAll('*');
            childElements.forEach((el) => {
              const element = el as HTMLElement;
              if (
                element.style.maxHeight &&
                element.style.maxHeight !== 'none'
              ) {
                element.style.maxHeight = 'none';
              }
              if (element.style.overflow === 'hidden') {
                element.style.overflow = 'visible';
              }
            });
          }

          // Also modify the cloned body
          const clonedBody = clonedDoc.body;
          clonedBody.style.overflow = 'visible';
          clonedBody.style.height = 'auto';
          clonedBody.style.width = '100%';
        },
        // Improved element filtering
        ignoreElements: (element) => {
          return (
            element.tagName === 'IFRAME' ||
            element.classList?.contains('fixed') ||
            element.classList?.contains('sticky') ||
            element.getAttribute('role') === 'dialog' ||
            element.classList?.contains('modal') ||
            element.classList?.contains('overlay') ||
            element.classList?.contains('toast') ||
            element.id === 'toast-container'
          );
        }
      });

      // Restore original scroll positions and body styles
      window.scrollTo(originalScrollLeft, originalScrollTop);
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;

      console.log('Final canvas dimensions:', canvas.width, canvas.height);

      // Validate the capture
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

      // Restore original scroll positions and body styles on error
      const originalScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const originalScrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      window.scrollTo(originalScrollLeft, originalScrollTop);
      document.body.style.overflow = '';
      document.body.style.height = '';

      // Try alternative method as fallback
      const alternativeCanvas = await captureScreenshotAlternative();
      if (alternativeCanvas) {
        return alternativeCanvas;
      }

      toast.error('Failed to capture screenshot. Please try again.');
      return null;
    }
  };

  const captureScreenshotAlternative =
    async (): Promise<HTMLCanvasElement | null> => {
      try {
        const dashboardElement = document.getElementById(dashboardElementId);
        if (!dashboardElement) {
          toast.error('Analytics dashboard not found. Please try again.');
          return null;
        }

        // Store original states
        const originalScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const originalScrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;
        const originalBodyOverflow = document.body.style.overflow;
        const originalBodyHeight = document.body.style.height;

        // Modify body for full capture
        document.body.style.overflow = 'visible';
        document.body.style.height = 'auto';

        // Scroll to top
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get dashboard position and dimensions
        const rect = dashboardElement.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        // Calculate full page dimensions
        const fullPageHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );

        const fullPageWidth = Math.max(
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.clientWidth,
          document.documentElement.scrollWidth,
          document.documentElement.offsetWidth
        );

        console.log('Full page dimensions:', {
          fullPageWidth,
          fullPageHeight,
          rect
        });

        // Capture the entire page
        const fullPageCanvas = await html2canvas(document.body, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          imageTimeout: 30000,
          width: fullPageWidth,
          height: fullPageHeight,
          scrollX: scrollLeft,
          scrollY: scrollTop,
          windowWidth: fullPageWidth,
          windowHeight: fullPageHeight,
          onclone: (clonedDoc) => {
            const clonedBody = clonedDoc.body;
            clonedBody.style.overflow = 'visible';
            clonedBody.style.height = 'auto';
            clonedBody.style.width = '100%';
          },
          ignoreElements: (element) => {
            return (
              element.getAttribute('role') === 'dialog' ||
              element.classList?.contains('modal') ||
              element.classList?.contains('overlay') ||
              element.classList?.contains('fixed') ||
              element.classList?.contains('toast') ||
              element.id === 'toast-container'
            );
          }
        });

        // Create a new canvas for the dashboard portion
        const dashboardCanvas = document.createElement('canvas');
        const ctx = dashboardCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Calculate the dashboard area in the full page capture
        const dashboardArea = {
          x: rect.left * 2, // Account for scale
          y: rect.top * 2,
          width: rect.width * 2,
          height: rect.height * 2
        };

        // Set canvas size to match dashboard dimensions
        dashboardCanvas.width = dashboardArea.width;
        dashboardCanvas.height = dashboardArea.height;

        // Draw the dashboard portion from the full page capture
        ctx.drawImage(
          fullPageCanvas,
          dashboardArea.x,
          dashboardArea.y,
          dashboardArea.width,
          dashboardArea.height,
          0,
          0,
          dashboardCanvas.width,
          dashboardCanvas.height
        );

        // Restore original states
        window.scrollTo(originalScrollLeft, originalScrollTop);
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;

        console.log(
          'Alternative capture dimensions:',
          dashboardCanvas.width,
          dashboardCanvas.height
        );

        return dashboardCanvas;
      } catch (error) {
        console.error('Alternative capture failed:', error);

        // Restore original states on error
        const originalScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const originalScrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;
        window.scrollTo(originalScrollLeft, originalScrollTop);
        document.body.style.overflow = '';
        document.body.style.height = '';

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

      // Determine orientation based on image dimensions
      const isLandscape = imgWidth > imgHeight;

      // Create PDF with appropriate orientation
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate scale to fit image in PDF while maintaining aspect ratio
      // Use a maximum scale to ensure readability and fit
      const maxScale = 0.85; // Use 85% of page width/height max
      const widthRatio = (pdfWidth * maxScale) / (imgWidth * 0.264583); // Convert pixels to mm
      const heightRatio = (pdfHeight * maxScale) / (imgHeight * 0.264583);
      const scale = Math.min(widthRatio, heightRatio, 1); // Don't scale up beyond 100%

      const finalWidth = imgWidth * 0.264583 * scale;
      const finalHeight = imgHeight * 0.264583 * scale;

      // Calculate if we need multiple pages for very tall content
      const headerHeight = 35; // Space for header
      const availableHeight = pdfHeight - headerHeight;
      const totalPages = Math.ceil(finalHeight / availableHeight);

      // Add header to first page
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

      if (totalPages === 1) {
        // Single page - center the image
        const x = (pdfWidth - finalWidth) / 2;
        const y = Math.max(headerHeight, (pdfHeight - finalHeight) / 2);

        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      } else {
        // For multi-page content, we'll use a different approach
        // Create a custom page size that can accommodate the full image
        const customWidth = Math.max(pdfWidth, finalWidth + 20); // Add margin
        const customHeight = Math.max(
          pdfHeight,
          finalHeight + headerHeight + 20
        ); // Add margin

        // Create a new PDF with custom size
        const customPdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [customWidth, customHeight]
        });

        // Add header
        customPdf.setFontSize(16);
        customPdf.setFont('helvetica', 'bold');
        customPdf.text('Analytics Dashboard Report', customWidth / 2, 15, {
          align: 'center'
        });

        customPdf.setFontSize(10);
        customPdf.setFont('helvetica', 'normal');
        customPdf.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          customWidth / 2,
          25,
          { align: 'center' }
        );

        // Add the full image
        const x = (customWidth - finalWidth) / 2;
        const y = headerHeight + 10; // Add some margin from header

        customPdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

        // Save the custom PDF
        customPdf.save(
          `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`
        );

        toast.success('Analytics report downloaded as PDF successfully!');
        return;
      }

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

  const generateXLS = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Overview Metrics Sheet
      if (overviewMetrics) {
        const overviewData = [
          { Metric: 'Total Users', Value: overviewMetrics.totalUsers },
          {
            Metric: 'User Growth Rate (%)',
            Value: overviewMetrics.userGrowthRate
          },
          {
            Metric: 'Engagement Rate (%)',
            Value: overviewMetrics.engagementRate
          },
          {
            Metric: 'Engagement Rate Change (%)',
            Value: overviewMetrics.engagementRateChange
          },
          { Metric: 'Deleted Users', Value: overviewMetrics.deletedUsers },
          {
            Metric: 'Unverified Users',
            Value: overviewMetrics.unverifiedUsers
          },
          {
            Metric: 'Active Users (%)',
            Value: overviewMetrics.activeUsersPercentage
          },
          {
            Metric: 'Inactive Users (%)',
            Value: overviewMetrics.inactiveUsersPercentage
          },
          {
            Metric: 'Unverified Users (%)',
            Value: overviewMetrics.unverifiedUsersPercentage
          },
          {
            Metric: 'Deleted Users (%)',
            Value: overviewMetrics.deletedUsersPercentage
          }
        ];
        const overviewSheet = XLSX.utils.json_to_sheet(overviewData);
        XLSX.utils.book_append_sheet(
          workbook,
          overviewSheet,
          'Overview Metrics'
        );
      }

      // New Users Data Sheet
      if (newUsersData) {
        const newUsersSheetData = [
          { Period: 'Current Value', Count: newUsersData.currentValue },
          ...newUsersData.chartData.map((item) => ({
            Period: item.label,
            Count: item.value
          }))
        ];
        const newUsersSheet = XLSX.utils.json_to_sheet(newUsersSheetData);
        XLSX.utils.book_append_sheet(workbook, newUsersSheet, 'New Users Data');
      }

      // User Distribution Sheet
      if (userDistribution) {
        const distributionData = [
          { Category: 'Total Users', Count: userDistribution.totalUsers },
          ...userDistribution.data.map((item) => ({
            Category: item.name,
            Count: item.value,
            Color: item.color
          }))
        ];
        const distributionSheet = XLSX.utils.json_to_sheet(distributionData);
        XLSX.utils.book_append_sheet(
          workbook,
          distributionSheet,
          'User Distribution'
        );
      }

      // User Activity Data Sheet
      if (userActivityData) {
        const activitySheet = XLSX.utils.json_to_sheet(userActivityData);
        XLSX.utils.book_append_sheet(workbook, activitySheet, 'User Activity');
      }

      // Summary Sheet
      const summaryData = [
        { 'Report Information': 'Analytics Dashboard Export' },
        { 'Generated Date': new Date().toLocaleDateString() },
        { 'Time Period': selectedPeriod },
        { '': '' }, // Empty row
        {
          'Data Included':
            'Overview Metrics, New Users Data, User Distribution, User Activity'
        }
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Save the file
      XLSX.writeFile(
        workbook,
        `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.xlsx`
      );

      toast.success('Analytics report downloaded as Excel successfully!');
    } catch (error) {
      console.error('Error generating XLS:', error);
      toast.error('Failed to generate Excel file. Please try again.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (exportFormat === 'xls') {
        generateXLS();
      } else {
        const canvas = await captureScreenshot();

        if (!canvas) {
          return; // Error already handled in captureScreenshot
        }

        if (exportFormat === 'jpg') {
          generateJPG(canvas);
        } else {
          generatePDF(canvas);
        }
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
          <DialogDescription className="sr-only">
            Export analytics data in Excel format with multiple sheets
            containing all metrics and chart data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Description */}
          <div className="rounded-lg bg-gray-50 py-4">
            <h4 className="mb-2 font-medium">Export Summary</h4>
            <p className="text-sm text-gray-600">
              {exportFormat === 'xls'
                ? 'Export analytics data in Excel format with multiple sheets containing all metrics and chart data.'
                : 'This will capture a high-quality screenshot of your complete analytics dashboard and download it in your selected format. The export includes all visible charts, metrics, and data.'}
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

              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                <RadioGroupItem value="xls" id="xls" />
                <Label
                  htmlFor="xls"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <FileSpreadsheet className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Excel (XLSX)</div>
                    <div className="text-sm text-gray-500">
                      Structured data with multiple sheets
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Export Info */}
          <div className="space-y-2 text-sm text-gray-600">
            {exportFormat === 'xls' ? (
              <>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  All analytics data will be exported in structured format
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Multiple sheets: Overview, New Users, Distribution, Activity
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                  Selected time period: {selectedPeriod}
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
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
                {exportFormat === 'xls' ? 'Generating...' : 'Capturing...'}
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
