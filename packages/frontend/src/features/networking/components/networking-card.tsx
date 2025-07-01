import { SharedIcons } from '@/shared/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  UserRoundIcon,
  MessageSquare,
  Linkedin,
  Handshake
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ConnectRequest } from '@/features/messages/components/common/connect-request';
import { useState } from 'react';
import { useNetworkingStore } from '../store';
import { ConnectionRequest } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ImagePreview } from '@/shared/components/image/image-preview';

interface NetworkingCardProps {
  profile: ConnectionRequest;
}

export const NetworkingCard = ({ profile }: NetworkingCardProps) => {
  const router = useRouter();

  const truncateBio = (bio: string, maxLength: number = 50) => {
    if (bio?.length <= maxLength) return bio;
    return `${bio?.slice(0, maxLength)}...`;
  };

  const handleViewProfile = () => {
    router.push(`/profile/${profile.id}`);
  };

  const { createConnectionRequest, updateConnectionRequest } =
    useNetworkingStore();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const getConnectionButton = () => {
    const status = profile?.connectionStatus?.status;
    const isSender = profile?.connectionStatus?.isSender;

    if (status === 'PENDING' && isSender) {
      return (
        <Button className="h-10 w-full" disabled>
          Request Sent
        </Button>
      );
    }

    if (status === 'PENDING' && !isSender) {
      return (
        <Button
          className="h-10 w-full"
          onClick={() => setIsResponseModalOpen(true)}
        >
          Request Received
        </Button>
      );
    }

    if (status === 'NO_REQUEST') {
      return (
        <Button className="h-10 w-full" onClick={handleConnect}>
          Connect
        </Button>
      );
    }

    if (status === 'REJECTED') {
      return (
        <Button
          className="h-10 w-full bg-error-500 text-white hover:bg-error-600 hover:text-white"
          disabled
        >
          Rejected
        </Button>
      );
    }

    if (status === 'APPROVED') {
      return (
        <Button
          className="h-10 w-full"
          onClick={() => setIsRejectionModalOpen(true)}
        >
          Connected
          <Handshake className="h-4 w-4" />
        </Button>
      );
    }
    return null;
  };

  const handleResponseSubmit = async (status: string) => {
    await updateConnectionRequest(
      profile.connectionStatus?.requestId?.toString() ?? '',
      {
        status: status as 'PENDING' | 'REJECTED' | 'ACCEPTED'
      }
    );
    setIsResponseModalOpen(false);
  };

  const handleConnect = () => {
    if (profile?.connectionStatus?.status === 'NO_REQUEST') {
      setIsConnectModalOpen(true);
    }
  };

  const handleConnectSubmit = (message: string) => {
    console.log('Connect message:', message);

    createConnectionRequest({
      recipient_id: profile.id,
      message: message
    });

    setIsConnectModalOpen(false);
  };

  return (
    <div className="flex min-h-[350px] w-full overflow-hidden rounded-2xl border border-neutral-light-500">
      <div className="relative flex w-full flex-col">
        <ConnectRequest
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          onSubmit={handleConnectSubmit}
        />

        <ResponseModal
          isOpen={isResponseModalOpen}
          onClose={() => setIsResponseModalOpen(false)}
          onAccept={() => handleResponseSubmit('APPROVED')}
          onReject={() => handleResponseSubmit('REJECTED')}
          senderName={`${profile.first_name} ${profile.last_name}`}
          message={profile.connectionStatus?.status}
        />

        <RejectionModal
          isOpen={isRejectionModalOpen}
          onClose={() => setIsRejectionModalOpen(false)}
          onConfirm={() => {
            handleResponseSubmit('REJECTED');
            setIsRejectionModalOpen(false);
          }}
          userName={`${profile.first_name} ${profile.last_name}`}
        />

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
            {profile.picture_upload_link && (
              <ImagePreview
                imagePath={profile.picture_upload_link ?? ''}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="h-full w-full object-cover"
                fill={true}
                priority={true}
              />
            )}
            {!profile.picture_upload_link && (
              <AvatarFallback>
                <UserRoundIcon className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>

          {/* Profile Info */}
          <div className="mt-2 flex flex-1 flex-col items-center gap-1">
            <h6 className="max-w-full truncate text-lg font-medium">
              {profile.first_name} {profile.last_name}
            </h6>
            <p className="max-w-full truncate text-sm text-neutral-dark-100">
              {profile.profession}
            </p>
            <p className="max-w-full truncate text-sm text-neutral-dark-100">
              @{profile.company_name}
            </p>

            <p className="line-clamp-3 max-w-full text-center text-sm text-neutral-dark-100">
              &ldquo;{truncateBio(profile.bio ?? '')}&rdquo;
            </p>

            {/* Social Icons */}
            <div className="mt-0 flex items-center gap-4">
              {profile.portfolio_link && (
                <SharedIcons.briefcase className="h-5 w-5" />
              )}
              {profile.linkedin_link && (
                <Linkedin className="h-4 w-4 text-neutral-dark-100" />
              )}
              {profile.github_link && (
                <SharedIcons.github className="h-4 w-4 text-neutral-dark-100" />
              )}
              {profile.twitter_link && (
                <SharedIcons.twitter className="h-5 w-5 text-neutral-dark-100" />
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="w-full space-y-2 pb-4 pt-2">
            <div className="flex gap-2">
              {(profile.connectionStatus?.status === 'APPROVED' ||
                (profile.connectionStatus?.status === 'PENDING' &&
                  profile.connectionStatus?.isSender)) && (
                <Button
                  variant="outline"
                  className="h-10 flex-1 gap-2 px-0"
                  onClick={() => router.push(`/messages/${profile.id}`)}
                >
                  <MessageSquare className="h-5 w-5" />
                  Message
                </Button>
              )}
              <Button
                className="h-10 flex-1 gap-2 px-0"
                onClick={handleViewProfile}
                variant="outline"
              >
                <UserRoundIcon className="h-4 w-4" />
                View
              </Button>
            </div>

            {getConnectionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  senderName: string;
  message?: string;
}

const ResponseModal = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
  senderName,
  message
}: ResponseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connection Request</DialogTitle>
          <DialogDescription className="sr-only">
            description of the modal
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className="my-4">
            <p className="pb-4 text-base text-neutral-dark-100">
              {senderName} would like to connect with you
            </p>
            <p className="text-base text-neutral-dark-100">
              Current Status:{' '}
              <span className="font-bold text-warning-500">{message}</span>
            </p>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReject}
            className="h-10 w-1/2 border-none bg-error-500 text-white hover:bg-error-600 hover:text-white"
          >
            Reject
          </Button>
          <Button
            onClick={onAccept}
            className="h-10 w-1/2 border-none bg-success-500 text-white hover:bg-success-600"
          >
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName
}: RejectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Connection</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove your connection with {userName}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="h-10 w-1/2">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-10 w-1/2 border-none bg-error-500 text-white hover:bg-error-600"
          >
            Remove Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
