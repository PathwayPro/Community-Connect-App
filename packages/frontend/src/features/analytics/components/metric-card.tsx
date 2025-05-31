import { Circle, LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'bg-gray-500',
  trend,
  trendValue,
  className
}: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-600">{title}</p>
          <p className="text-5xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              iconColor
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
      {trendValue && (
        <div className="flex items-center gap-1">
          {trend === 'up' && (
            <TrendingUp
              className={cn('h-4 w-4', getTrendColor())}
              strokeWidth={2}
            />
          )}

          {trend === 'down' && (
            <TrendingDown
              className={cn('h-4 w-4', getTrendColor())}
              strokeWidth={2}
            />
          )}

          {trend === 'neutral' && (
            <Circle
              className={cn('h-4 w-4', getTrendColor())}
              strokeWidth={2}
            />
          )}

          <span className={cn('text-sm font-medium', getTrendColor())}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-600">from previous period</span>
        </div>
      )}
    </div>
  );
};
