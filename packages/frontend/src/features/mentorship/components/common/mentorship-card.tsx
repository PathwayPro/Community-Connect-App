import { MentorshipIcons } from '../icons';
import { SharedIcons } from '@/shared/components/icons';

interface MentorshipCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendValue: string;
  trendText: string;
  trendUp: boolean;
}

const MentorshipCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendText,
  trendUp
}: MentorshipCardProps) => {
  const MentorshipIcon = MentorshipIcons[icon as keyof typeof MentorshipIcons];
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
        <MentorshipIcon className="mr-11 h-20 w-20" />
        <SharedIcons.info className="absolute right-0 top-0 h-6 w-6 text-neutral-light-500" />
      </div>
    </div>
  );
};

export default MentorshipCard;
