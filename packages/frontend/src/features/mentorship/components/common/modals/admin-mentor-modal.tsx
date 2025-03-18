import { cn } from '@/shared/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { FileText, MessageSquare } from 'lucide-react';
import { MentorshipAdmin } from '../../table/data';
import { UserRoundIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { useState } from 'react';
import { Rating } from '@/shared/components/ui/rating';

interface AdminMentorModalCardProps {
  data: MentorshipAdmin;
  isRating?: boolean;
}

export const AdminMentorModalCard = ({
  data,
  isRating = false
}: AdminMentorModalCardProps) => {
  const {
    identity,
    profession,
    experience,
    email,
    experienceDescription,
    review,
    ratingsGroup
  } = data;
  const [isOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-[90px] hover:bg-primary hover:text-white"
        >
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[552px] max-w-[552px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {isRating ? 'Session Review' : 'Mentor Profile'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the mentees profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-3xl bg-neutral-light-300 p-4">
          <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-light-500 bg-white p-6">
            <div
              className={cn(
                'absolute top-0 h-[70px] w-full rounded-t-2xl bg-primary-200'
              )}
            />

            <Avatar className="h-20 w-20 border-4 border-white bg-warning-500">
              <AvatarImage
                src={identity.avatar}
                alt="Mentor avatar"
                className="h-full w-full"
              />

              <AvatarFallback>
                <UserRoundIcon className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2 text-center">
              <h6 className="text-xl font-semibold">
                {identity.firstName} {identity.lastName}
              </h6>
              <p className="mb-6 text-sm text-neutral-dark-100">{profession}</p>

              <p className="text-sm text-neutral-dark-100">
                Email: <span className="text-neutral-dark-600"> {email}</span>
              </p>

              <p className="text-sm text-neutral-dark-100">
                Years of Experience:{' '}
                <span className="text-neutral-dark-600"> {experience}</span>
              </p>

              <p className="flex flex-col space-x-2 text-sm text-neutral-dark-100">
                <span>{isRating ? 'Review' : 'Why do you want a mentor?'}</span>
                <span className="text-neutral-dark-600">
                  {isRating ? review : experienceDescription}
                </span>
              </p>
            </div>

            {isRating && (
              <div className="flex w-full flex-col items-center gap-2 px-12">
                <span>Ratings</span>
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-neutral-dark-600">
                    Motivational
                  </span>
                  <Rating rating={ratingsGroup?.motivational || 0} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-neutral-dark-600">
                    Communication
                  </span>
                  <Rating rating={ratingsGroup?.communication || 0} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-neutral-dark-600">
                    Knowledge
                  </span>
                  <Rating rating={ratingsGroup?.knowledge || 0} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-neutral-dark-600">
                    Problem Solving
                  </span>
                  <Rating rating={ratingsGroup?.problemSolving || 0} />
                </div>
              </div>
            )}

            {!isRating && (
              <div className="flex w-full gap-2">
                <Button variant="outline" className="h-10 flex-1 gap-2 px-0">
                  <MessageSquare className="h-5 w-5" />
                  Message
                </Button>
                <Button
                  className="h-10 flex-1 gap-2 px-0"
                  onClick={() => {}}
                  variant="outline"
                >
                  <FileText className="h-5 w-5" />
                  View Resume
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            className="mx-auto h-10 w-full"
            onClick={() =>
              isRating ? setIsModalOpen(false) : console.log('match mentor')
            }
          >
            {isRating ? 'Go Back' : 'Match Mentor'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
