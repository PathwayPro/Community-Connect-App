import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { EyeIcon, Link } from 'lucide-react';
import { WorkSettings } from '../../lib/constants/enums';

interface JobCardProps {
  job: string;
  company: string;
  province: string;
  city: string;
  settings: WorkSettings;
  link_apply: string;
  description: string;
  experience: string;
  salary_range: {
    from: number;
    to: number;
  };
  image?: string;
  onLearnMore: () => void;
}

export function JobCard({
  job,
  company,
  province,
  city,
  settings,
  link_apply,
  experience,
  salary_range,
  image,
  onLearnMore
}: JobCardProps) {
  console.log('image in the job card :', image);

  const location = `${city}, ${province}`;
  const companyLogoUrl = image
    ? `${process.env.NEXT_PUBLIC_API_URL}/files/${image}`
    : undefined;

  const handleApply = () => {
    window.open(link_apply, '_blank');
  };

  const handleLearnMore = () => {
    onLearnMore();
  };

  return (
    <Card className="relative flex w-full max-w-full flex-col gap-4 p-4 sm:h-[120px] sm:flex-row sm:items-center sm:gap-4">
      <div className="absolute left-0 top-0 h-full w-[40px] shrink-0 rounded-l-xl bg-primary-200 sm:w-[54px]" />

      <div className="flex w-full gap-3 sm:items-center sm:gap-4">
        <Avatar className="h-12 w-12 border border-neutral-light-500 bg-white sm:h-16 sm:w-16">
          <AvatarImage src={companyLogoUrl} alt={company} />
          <AvatarFallback>{company[0]}</AvatarFallback>
        </Avatar>

        {/* Right pane: stacks content and actions on mobile, side-by-side on larger screens */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="mt-1 flex flex-1 flex-col sm:mt-4 sm:flex-row">
            <div className="flex w-full min-w-0 flex-col gap-1 sm:w-1/3">
              <p className="line-clamp-1 text-base font-semibold sm:text-lg">
                {job}
              </p>
              <p className="line-clamp-1 text-sm text-neutral-dark-100 sm:text-base">
                {company}
              </p>
            </div>

            <div className="mt-3 grid w-full grid-cols-1 gap-3 text-xs text-muted-foreground sm:mt-0 sm:flex sm:w-2/3 sm:justify-start sm:gap-6 sm:text-sm">
              <div className="flex min-w-0 flex-col items-start gap-1">
                <span>Experience</span>
                <p className="line-clamp-2 break-words text-sm sm:line-clamp-1 sm:text-base">
                  {experience || 'Not specified'}
                </p>
              </div>
              <div className="flex min-w-0 flex-col items-start gap-1 sm:w-1/3">
                <span>Location</span>
                <p className="whitespace-normal break-words text-sm sm:text-base">
                  {location}
                </p>
              </div>
              <div className="flex min-w-0 flex-col items-start gap-1">
                <span>Salary</span>
                <p className="truncate text-sm sm:text-base">
                  ${salary_range.from} - ${salary_range.to}
                </p>
              </div>
              <div className="flex min-w-0 flex-col items-start gap-1">
                <span>Job Type</span>
                <p className="truncate text-sm sm:text-base">{settings}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-row justify-end gap-2 sm:w-auto sm:flex-col sm:justify-start">
            <Button
              onClick={handleApply}
              className="h-9 w-9 self-end rounded-full p-0 sm:h-10 sm:w-[240px] sm:rounded-xl sm:px-4"
              aria-label="Apply now"
            >
              <Link className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Apply Now</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLearnMore}
              className="h-9 w-9 self-end rounded-full p-0 sm:h-10 sm:w-[240px] sm:rounded-xl sm:px-4"
              aria-label="Learn more"
            >
              <EyeIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Learn More</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
