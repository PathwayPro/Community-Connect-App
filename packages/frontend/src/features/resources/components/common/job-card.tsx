import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Link } from 'lucide-react';
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
    <Card className="relative flex h-[120px] w-full items-center gap-4 p-4">
      <div className="absolute left-0 h-full w-[54px] shrink-0 rounded-l-xl bg-primary-200" />

      <div className="flex w-full items-center gap-4">
        <Avatar className="h-16 w-16 border border-neutral-light-500 bg-white">
          <AvatarImage src={companyLogoUrl} alt={company} />
          <AvatarFallback>{company[0]}</AvatarFallback>
        </Avatar>

        <div className="mt-4 flex flex-1">
          <div className="flex w-1/3 flex-col gap-1">
            <p className="paragraph-lg">{job}</p>
            <p className="paragraph-sm text-neutral-dark-100">{company}</p>
          </div>

          <div className="flex w-2/3 justify-start gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col items-start gap-1">
              <span>Experience</span>
              <p className="paragraph-lg">{experience || 'Not specified'}</p>
            </div>
            <div className="flex w-1/3 flex-col items-start gap-1">
              <span>Location</span>
              <p className="paragraph-lg">{location}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span>Salary</span>
              <p className="paragraph-lg">
                ${salary_range.from} - ${salary_range.to}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span>Job Type</span>
              <p className="paragraph-lg">{settings}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleApply} className="h-10 w-[240px]">
            <Link className="h-5 w-5" />
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={handleLearnMore}
            className="h-10 w-[240px]"
          >
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  );
}
