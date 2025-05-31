import { PdfPreviewModal } from '@/shared/components/pdf/pdf-preview-modal';
import { Download } from 'lucide-react';

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
  type,
  file
}: ResourcePreviewCardProps) {
  const filePath = `
  ${process.env.NEXT_PUBLIC_API_URL}/files/${file}`;

  const actions = [
    {
      label: 'Back to Resources',
      onClick: onClose,
      variant: 'outline' as const
    },
    {
      label: 'Get Resource',
      href: filePath,
      variant: 'default' as const,
      icon: <Download className="h-6 w-6" />,
      external: true
    }
  ];

  return (
    <PdfPreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Resource Preview"
      filePath={filePath}
      actions={actions}
    >
      <h2 className="text-h3 font-semibold">{title}</h2>
      <p className="paragraph-lg text-justify font-normal">{details}</p>
      <p className="paragraph-lg text-justify font-normal">File Type: {type}</p>
    </PdfPreviewModal>
  );
}
