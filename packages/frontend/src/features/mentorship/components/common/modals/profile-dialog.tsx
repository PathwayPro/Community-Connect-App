import { FileText, MessageSquare, User } from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/features/user-profile/types';
import { MentorResponse } from '../../../types';

interface ProfileDialogProps {
  mentor: MentorResponse | null;
  user: UserProfile | null;
}

export const ProfileDialog = ({ mentor, user }: ProfileDialogProps) => {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10">
          <UserRoundPlus className="h-4 w-4" /> View Profile
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle className="sr-only">Mentor Profile</DialogTitle>
        <DialogDescription className="sr-only">
          View your profile and update your information
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="min-w-[1000px] p-12">
        <div className="flex flex-col gap-6 py-4">
          {/* <div className="flex flex-col gap-2"> */}
          <h5 className="font-semibold">
            {user?.firstName} {user?.lastName}
          </h5>
          {/* </div> */}
          <div className="flex gap-2">
            <p className="text-paragraph-lg font-semibold">Email :</p>
            <p className="font-normal">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-paragraph-lg font-semibold">
              Field of Expertise :
            </p>
            <p className="font-normal">{user?.profession}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-paragraph-lg font-semibold">
              Years of Experience :
            </p>
            <p className="font-normal">{user?.experience}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-paragraph-lg font-semibold">
              Why you want to be a Mentor :
            </p>
            <p className="font-normal">{mentor?.experience_details}</p>
          </div>
        </div>
        <div className="flex justify-start gap-4 pt-4">
          <Button className="w-[180px]">
            <MessageSquare className="mr-1 h-5 w-5" />
            Message
          </Button>
          <Button className="w-[180px]" variant="outline">
            <FileText className="mr-1 h-5 w-5" />
            View Resume
          </Button>
          <Button
            className="w-[180px]"
            variant="outline"
            onClick={() => router.push(`/profile`)}
          >
            <User className="mr-1 h-5 w-5" />
            View Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
