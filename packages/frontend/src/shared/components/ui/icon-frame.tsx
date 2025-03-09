import { cn } from '@/shared/lib/utils';
import { SharedIcons } from '../icons';

interface IconFrameProps {
  icon: keyof typeof SharedIcons;
  variant?: 'square' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export function IconFrame({
  icon,
  variant = 'square',
  size = 'md',
  className,
  iconClassName
}: IconFrameProps) {
  const Icon = SharedIcons[icon as keyof typeof SharedIcons];

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        sizeClasses[size],
        variant === 'circle' && 'rounded-full',
        variant === 'square' && 'rounded-md',
        className
      )}
    >
      <div className={cn(iconSizeClasses[size], iconClassName)}>
        <Icon className={cn('h-5 w-5', iconClassName)} />
      </div>
    </div>
  );
}
