'use client';

import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SubscriberCardProps {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  avatar?: string;
}

export const SubscriberCard = ({
  id,
  firstName,
  lastName,
  profession,
  avatar
}: SubscriberCardProps) => {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/profile/${id}`);
  };

  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 bg-warning-500">
          <Image
            src={avatar || '/profile/profile.png'}
            alt={`${firstName} ${lastName}`}
            width={40}
            height={40}
            priority
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div>
          <h4 className="font-semibold">
            {firstName} {lastName}
          </h4>
          <p className="text-sm text-muted-foreground">{profession}</p>
        </div>
      </div>
      <Button
        onClick={handleViewProfile}
        className="h-10 w-fit px-4 py-2"
        variant="outline"
      >
        <UserIcon className="h-6 w-6" />
        View Profile
      </Button>
    </Card>
  );
};
