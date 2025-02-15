import { SharedIcons } from '@/shared/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { UserRoundIcon, MessageSquare, Linkedin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface NetworkingProfile {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  bio: string;
  avatarUrl: string;
  isConnected: boolean;
  role: 'USER' | 'MENTOR' | 'ADMIN';
  skills: string[];
  profession: string;
  country: string;
}

interface NetworkingCardProps {
  profile: NetworkingProfile;
  onViewProfile?: () => void;
}

export const NetworkingCard = ({
  profile,
  onViewProfile
}: NetworkingCardProps) => {
  const truncateBio = (bio: string, maxLength: number = 50) => {
    if (bio.length <= maxLength) return bio;
    return `${bio.slice(0, maxLength)}...`;
  };

  return (
    <div className="flex h-[440px] w-full overflow-hidden rounded-2xl border border-neutral-light-500">
      <div className="relative flex w-full flex-col">
        {/* Header Background */}
        <div
          className={cn(
            'h-[70px] w-full bg-primary-200',
            profile.role === 'MENTOR' && 'bg-secondary-200'
          )}
        />

        {/* Mentor Badge */}
        {profile.role === 'MENTOR' && (
          <div className="absolute right-4 top-4 z-[10] flex flex-col items-center justify-end">
            <SharedIcons.logo className="h-6 w-6 rounded-full bg-white" />
            <p className="z-[10] text-xs text-neutral-dark-600">Mentor</p>
          </div>
        )}

        {/* Content Container */}
        <div className="flex flex-1 flex-col items-center px-4">
          {/* Avatar - positioned to overlap with header */}
          <Avatar className="-mt-14 h-[110px] w-[110px] border-4 border-white bg-warning-500">
            <AvatarImage
              src={profile.avatarUrl}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>
              <UserRoundIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="mt-4 flex flex-1 flex-col items-center gap-2">
            <h6 className="max-w-full truncate text-lg font-medium">
              {profile.firstName} {profile.lastName}
            </h6>
            <p className="max-w-full truncate text-sm text-neutral-dark-100">
              {profile.profession}
            </p>
            <p className="max-w-full truncate text-sm text-neutral-dark-100">
              @{profile.company}
            </p>

            <p className="line-clamp-3 max-w-full text-center text-sm text-neutral-dark-100">
              &ldquo;{truncateBio(profile.bio)}&rdquo;
            </p>

            {/* Social Icons */}
            <div className="mt-2 flex items-center gap-4">
              <SharedIcons.briefcase className="h-5 w-5" />
              <Linkedin className="h-4 w-4 text-neutral-dark-100" />
              <SharedIcons.ball className="h-4 w-4" />
              <SharedIcons.twitter className="h-5 w-5" />
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="w-full space-y-2 py-4">
            <div className="flex gap-2">
              <Button variant="outline" className="h-10 flex-1 gap-2 px-0">
                <MessageSquare className="h-5 w-5" />
                Message
              </Button>
              <Button
                className="h-10 flex-1 gap-2 px-0"
                onClick={onViewProfile}
                variant="outline"
              >
                <UserRoundIcon className="h-4 w-4" />
                View
              </Button>
            </div>
            <Button className="h-10 w-full">
              {profile.isConnected ? 'Connected' : 'Connect'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
