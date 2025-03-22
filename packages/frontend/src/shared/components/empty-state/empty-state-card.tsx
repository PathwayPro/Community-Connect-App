import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateCard({
  title,
  description,
  icon: Icon,
  action
}: EmptyStateCardProps) {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <Icon className="h-12 w-12 text-neutral-light-500" />
      <h5 className="mt-4 font-semibold">{title}</h5>
      <p className="mt-4 text-neutral-dark-300">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6 h-10">
          {action.label}
        </Button>
      )}
    </Card>
  );
}
