/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

export const PdfPreview = ({ filePath }: { filePath: string }) => {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    // Open the PDF in a new tab
    window.open(filePath, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg shadow-lg">
      {/* PDF display area */}
      <div className="flex justify-center">
        <div
          className="overflow-hidden rounded-lg border bg-white shadow-sm"
          style={{
            width: `${Math.min(1000 * (zoom / 100), 1000)}px`,
            maxWidth: '100%'
          }}
        >
          {/* PDF iframe - this is the simplest approach */}
          <iframe
            src={`${filePath}#zoom=${zoom}`}
            className="h-[600px] w-full border-0"
            title="PDF Viewer"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`,
              height: `${600 / (zoom / 100)}px`
            }}
          />
        </div>
      </div>

      {/* Alternative: Simple embed for broader compatibility */}
      <div className="border-t bg-gray-50 p-4">
        <div className="text-center text-sm text-gray-600">
          If the PDF doesn&apos;t display properly, you can{' '}
          <button
            onClick={handleDownload}
            className="text-blue-500 underline hover:text-blue-700"
          >
            download it directly
          </button>{' '}
          or{' '}
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            open in new tab
          </a>
        </div>
      </div>
    </div>
  );
};
