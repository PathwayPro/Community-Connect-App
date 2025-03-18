import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Link } from 'lucide-react';
import { JobCardProps } from '@/features/resources/types';

export function JobCard({
  companyLogo,
  companyName,
  jobTitle,
  experience,
  location,
  salaryRange,
  jobType,
  //   jobDescription,
  onApply,
  onLearnMore
}: JobCardProps) {
  return (
    <Card className="relative flex h-[120px] w-full items-center gap-4 p-4">
      <div className="absolute left-0 h-full w-[54px] shrink-0 rounded-l-xl bg-primary-200" />

      <div className="flex w-full items-center gap-4">
        <Avatar className="h-16 w-16 border border-neutral-light-500 bg-white">
          <AvatarImage src={companyLogo} alt={companyName} />
          <AvatarFallback>{companyName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1">
          <div className="flex w-1/3 flex-col gap-1">
            <p className="paragraph-lg">{jobTitle}</p>
            <p className="paragraph-sm text-neutral-dark-100">{companyName}</p>
          </div>

          <div className="flex w-2/3 items-center justify-start gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col items-start gap-1">
              <span>Experience</span>
              <p className="paragraph-lg">{experience}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span>Location</span>
              <p className="paragraph-lg">{location}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span>Salary</span>
              <p className="paragraph-lg">{salaryRange}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span>Job Type</span>
              <p className="paragraph-lg">{jobType}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={onApply} className="h-10 w-[240px]">
            <Link className="h-5 w-5" />
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={onLearnMore}
            className="h-10 w-[240px]"
          >
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  );
}
