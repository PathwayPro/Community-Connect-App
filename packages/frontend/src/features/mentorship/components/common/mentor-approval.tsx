import { Card } from '@/shared/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { FileTextIcon } from 'lucide-react';
// import { MentorshipAdmin } from '../table/data';
import { MentorshipAdmin } from '../../types';
import { cn } from '@/shared/lib/utils';
import { SharedIcons } from '@/shared/components/icons';
import { DropdownMenuComponent } from '@/shared/components/modal/dropdown-menu';
import { Badge } from '@/shared/components/ui/badge';

interface MentorApprovalProps {
  mentorProfile: MentorshipAdmin;
}

export const MentorApproval = ({ mentorProfile }: MentorApprovalProps) => {
  const {
    identity,
    experience,
    experienceDescription,
    profession,
    email,
    capacity,
    availability,
    status
  } = mentorProfile;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 rounded-3xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h6 className="font-semibold">Mentor Approval</h6>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full border-none px-4 py-1 text-sm text-white',
                status === 'Approved'
                  ? 'bg-success-500'
                  : status === 'Pending'
                    ? 'bg-warning-500'
                    : 'bg-error-500'
              )}
            >
              {status}
            </Badge>
          </div>
          <DropdownMenuComponent />
        </div>
        <Card className="relative w-full min-w-full bg-neutral-light-100 p-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Header Background */}
            <div
              className={cn(
                'absolute top-0 h-[70px] w-full shrink-0 rounded-t-xl',
                status === 'Approved'
                  ? 'bg-secondary-200'
                  : status === 'Pending'
                    ? 'bg-primary-200'
                    : 'bg-error-500'
              )}
            />

            {/* Mentor Badge */}
            {status === 'Approved' && (
              <div className="absolute right-4 top-0 z-[10] flex flex-col items-center justify-end">
                <SharedIcons.logo className="h-6 w-6 rounded-full bg-white" />
                <p className="z-[10] text-xs text-neutral-dark-600">Mentor</p>
              </div>
            )}

            {/* Company Avatar */}
            <Avatar className="h-24 w-24 border border-neutral-light-500 bg-warning-500">
              <AvatarImage
                src={identity.avatar}
                alt={`${identity.firstName} ${identity.lastName} avatar`}
              />
              <AvatarFallback>
                {identity.firstName[0]}
                {identity.lastName[0]}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <div className="flex flex-col items-center gap-2">
              <h5 className="font-semibold">
                {identity.firstName} {identity.lastName}
              </h5>
              <span className="paragraph-lg text-muted-foreground">
                {profession}
              </span>

              {/* Email */}
              <span className="paragraph-lg text-muted-foreground">
                {email}
              </span>
            </div>

            {/* Job Details */}
            <div className="flex items-center justify-start gap-6 py-4 text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span>Experience</span>
                <p className="paragraph-lg">{experience}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span>Capacity</span>
                <p className="paragraph-lg">{capacity}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span>Availability</span>
                <p className="paragraph-lg">{availability}</p>
              </div>
            </div>

            {/* Job Description */}
            <div className="w-full p-4">
              <h6 className="self-start pb-4 font-semibold">
                Have you mentored before?
              </h6>
              <p className="paragraph-lg leading-6">{experienceDescription}</p>
            </div>

            {/* Apply Button */}
            <Button
              className="flex h-12 w-full items-center gap-2"
              variant="outline"
            >
              <FileTextIcon className="h-6 w-6" />
              View Resume
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
