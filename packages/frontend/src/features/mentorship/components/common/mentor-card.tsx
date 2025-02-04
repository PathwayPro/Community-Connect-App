import { IconFrame } from '@/shared/components/ui/icon-frame';
import { SharedIcons } from '@/shared/components/icons';

interface MentorCardProps {
  title: string;
  value: string;
  icon: keyof typeof SharedIcons;
  trend: string;
  trendValue: string;
  trendText: string;
  trendUp: boolean;
}

const MentorCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendText,
  trendUp
}: MentorCardProps) => {
  const TrendIcon = SharedIcons[trend as keyof typeof SharedIcons];

  return (
    <div className="flex h-[156px] w-full min-w-[380px] justify-between rounded-2xl border border-neutral-light-400 bg-neutral-light-200 p-4 shadow-sm">
      <div className="relative flex w-full flex-col">
        <p className="text-base font-normal">{title}</p>
        <h4 className="font-bold">{value}</h4>
        <div className="absolute bottom-0 left-0 flex items-center gap-1">
          <TrendIcon
            className={`h-6 w-6 ${trendUp ? 'text-success-500' : 'text-error-500'}`}
          />
          <p
            className={`text-xs font-medium ${
              trendUp ? 'text-success-500' : 'text-error-500'
            }`}
          >
            {trendValue}
          </p>
          <p className="text-xs font-medium">{trendText}</p>
        </div>
      </div>
      <div className="relative flex items-center gap-2">
        <IconFrame
          icon={icon as keyof typeof SharedIcons}
          variant="circle"
          size="lg"
          className="mr-7 h-20 w-20 bg-secondary-200"
          iconClassName="h-9 w-9"
        />
        <SharedIcons.info className="absolute right-0 top-0 h-6 w-6 text-neutral-light-500" />
      </div>
    </div>
  );
};

export default MentorCard;
