import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Link } from 'lucide-react';
import { JobCardProps } from '@/features/resources/types';

export function ExpandedJobCard({
  companyLogo,
  companyName,
  jobTitle,
  jobDescription,
  onApply,
  experience,
  location,
  salaryRange,
  jobType
}: JobCardProps) {
  return (
    <Card className="relative w-full min-w-full bg-neutral-light-100 p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="absolute top-0 h-[70px] w-full shrink-0 rounded-t-xl bg-primary-200" />

        {/* Company Avatar */}
        <Avatar className="h-24 w-24 border border-neutral-light-500 bg-white">
          <AvatarImage src={companyLogo} alt={`${companyName} logo`} />
          <AvatarFallback>{companyName[0]}</AvatarFallback>
        </Avatar>

        {/* Job Title */}
        <h5>{jobTitle}</h5>

        {/* Company Name */}
        <span className="paragraph-lg text-muted-foreground">
          {companyName}
        </span>

        {/* Job Details */}
        <div className="flex items-center justify-start gap-6 py-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            <span>Experience</span>
            <p className="paragraph-lg">{experience}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span>Location</span>
            <p className="paragraph-lg">{location}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span>Salary</span>
            <p className="paragraph-lg">{salaryRange}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span>Job Type</span>
            <p className="paragraph-lg">{jobType}</p>
          </div>
        </div>

        {/* Job Description */}
        <div className="w-full rounded-xl bg-neutral-light-200 p-4">
          <h6 className="self-start font-semibold">Job Description</h6>
          <ScrollArea className="h-[250px]">
            <p className="paragraph-lg whitespace-pre-wrap">{jobDescription}</p>
          </ScrollArea>
        </div>

        {/* Apply Button */}
        <Button onClick={onApply} className="h-12 w-[300px]">
          <Link className="h-6 w-6" />
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
