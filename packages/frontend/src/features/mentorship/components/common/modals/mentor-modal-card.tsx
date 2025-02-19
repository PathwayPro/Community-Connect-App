import { SharedIcons } from '@/shared/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { UserRoundIcon, MessageSquare, Linkedin, FileText } from 'lucide-react';
import { Mentor } from './past-mentors-modal';
import { cn } from '@/shared/lib/utils';

interface MentorModalCardProps {
  mentor: Mentor;
  onViewProfile?: () => void;
}

export const MentorModalCard = ({
  mentor,
  onViewProfile
}: MentorModalCardProps) => {
  return (
    <div className="relative flex items-center overflow-hidden rounded-2xl border border-neutral-light-500">
      <div className="absolute left-0 top-0 h-full w-[72px] shrink-0 bg-secondary-200" />
      <div className="flex flex-1 items-center gap-4 bg-white py-5 pl-6 pr-5">
        <Avatar className="h-[86px] w-[86px] border-4 border-white bg-warning-500">
          <AvatarImage
            src={mentor.avatarUrl}
            alt="Mentor avatar"
            className="h-full w-full"
          />

          <AvatarFallback>
            <UserRoundIcon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <h6 className="text-lg font-normal">
            {mentor.firstName} {mentor.lastName}
          </h6>
          <p className="text-sm text-neutral-dark-100">{mentor.profession}</p>
          <div className="flex items-center gap-4">
            <SharedIcons.briefcase className="h-5 w-5" />
            <Linkedin className="h-4 w-4 text-neutral-dark-100" />
            <SharedIcons.ball className="h-4 w-4" />
            <SharedIcons.twitter className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="flex-1 gap-2">
            <MessageSquare className="h-5 w-5" />
            Message
          </Button>
          <Button className="flex-1 gap-2" onClick={onViewProfile}>
            <UserRoundIcon className="h-4 w-4" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export const MentorModalCardExpanded = ({ mentor }: MentorModalCardProps) => {
  return (
    <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-light-500 bg-white p-6">
      <div
        className={cn(
          'absolute top-0 h-[70px] w-full rounded-t-2xl',
          mentor.isMentor ? 'bg-secondary-200' : 'bg-primary-200'
        )}
      />

      {mentor.isMentor && (
        <div className="absolute right-4 top-4 z-[10] flex flex-col items-center justify-end">
          <SharedIcons.logo className="h-6 w-6 rounded-full bg-white" />
          <p className="z-[10] text-xs text-neutral-dark-600">Mentor</p>
        </div>
      )}

      <Avatar className="h-20 w-20 border-4 border-white bg-warning-500">
        <AvatarImage
          src={mentor.avatarUrl}
          alt="Mentor avatar"
          className="h-full w-full"
        />

        <AvatarFallback>
          <UserRoundIcon className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2 text-center">
        <h6 className="text-xl font-semibold">
          {mentor.firstName} {mentor.lastName}
        </h6>
        <p className="mb-6 text-sm text-neutral-dark-100">
          {mentor.profession}
        </p>

        {mentor.isMentor && (
          <p className="text-sm text-neutral-dark-100">
            Field of Expertise:{' '}
            <span className="text-neutral-dark-600"> {mentor.expertise}</span>
          </p>
        )}
        <p className="text-sm text-neutral-dark-100">
          Company:{' '}
          <span className="text-neutral-dark-600"> {mentor.company}</span>
        </p>

        <p className="text-sm text-neutral-dark-100">
          Email: <span className="text-neutral-dark-600"> {mentor.email}</span>
        </p>
      </div>

      <div className="flex items-center gap-6 py-2">
        <SharedIcons.ball className="h-5 w-5" />
        <SharedIcons.briefcase className="h-5 w-5" />
        <Linkedin className="h-4 w-4 text-neutral-dark-100" />
        <SharedIcons.twitter className="h-5 w-5" />
      </div>

      <div className="flex w-full gap-2">
        <Button className="h-10 w-full">
          <FileText className="mr-1 h-5 w-5" />
          View Resume
        </Button>
      </div>
    </div>
  );
};
