import { IconFrame } from '@/shared/components/ui/icon-frame';
import { SharedIcons } from '@/shared/components/icons';

interface MenteeCardProps {
  title: string;
  value: string;
  icon: keyof typeof SharedIcons;
}

const MenteeCard = ({ title, value, icon }: MenteeCardProps) => {
  return (
    <div className="flex h-[112px] w-full min-w-[664px] justify-between rounded-2xl border border-neutral-light-400 bg-neutral-light-200 p-4 shadow-sm">
      <div className="flex w-full flex-col gap-2">
        <h5 className="font-normal">{title}</h5>
        <h4 className="font-bold">{value}</h4>
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

export default MenteeCard;
