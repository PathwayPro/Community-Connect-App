'use client';

import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { UserIcon, XIcon, CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEventStore } from '../../store';
import { useState } from 'react';
import { EventSubscriptionStatus } from '../../types';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/components/ui/alert-dialog';
import { Badge } from '@/shared/components/ui/badge';

interface SubscriberCardProps {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  avatar?: string;
  subscriptionId: number;
  status: EventSubscriptionStatus;
  tabType: string;
  onRefresh: () => Promise<void>;
}

export const SubscriberCard = ({
  id,
  firstName,
  lastName,
  profession,
  avatar,
  subscriptionId,
  status,
  tabType,
  onRefresh
}: SubscriberCardProps) => {
  const router = useRouter();
  const { updateEventSubscription } = useEventStore();
  const { showAlert } = useAlertDialog();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const handleViewProfile = () => {
    router.push(`/profile/${id}`);
  };

  const performRejection = async () => {
    try {
      const response = await updateEventSubscription(subscriptionId, {
        new_status: EventSubscriptionStatus.REJECTED,
        message: 'Rejected by admin'
      });

      if (response.status === EventSubscriptionStatus.REJECTED) {
        showAlert({
          type: 'success',
          title: 'Subscriber Rejected',
          description: `${firstName} ${lastName} has been rejected from the event.`
        });

        await onRefresh();
      }
    } catch (error) {
      console.error('Error rejecting subscriber:', error);
      showAlert({
        type: 'error',
        title: 'Error Rejecting Subscriber',
        description: 'An error occurred while rejecting the subscriber.'
      });
    }

    setIsRejectDialogOpen(false);
  };

  const performApproval = async () => {
    try {
      const response = await updateEventSubscription(subscriptionId, {
        new_status: EventSubscriptionStatus.APPROVED,
        message: 'Approved by admin'
      });

      if (response.status === EventSubscriptionStatus.APPROVED) {
        showAlert({
          type: 'success',
          title: 'Subscriber Approved',
          description: `${firstName} ${lastName} has been approved for the event.`
        });

        await onRefresh();
      }
    } catch (error) {
      console.error('Error approving subscriber:', error);
      showAlert({
        type: 'error',
        title: 'Error Approving Subscriber',
        description: 'An error occurred while approving the subscriber.'
      });
    }

    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    setIsRejectDialogOpen(true);
  };

  const handleApprove = () => {
    setIsApproveDialogOpen(true);
  };

  const getStatusBadge = () => {
    switch (status) {
      case EventSubscriptionStatus.APPROVED:
        return <Badge className="bg-green-500">Approved</Badge>;
      case EventSubscriptionStatus.REJECTED:
        return <Badge className="bg-red-500">Rejected</Badge>;
      case EventSubscriptionStatus.PENDING:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <>
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
            <h5 className="font-semibold">
              {firstName} {lastName}
            </h5>
            <p className="text-sm text-muted-foreground">{profession}</p>
            <div className="mt-2">{getStatusBadge()}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleViewProfile}
            className="h-10 w-fit px-4 py-2"
            variant="outline"
          >
            <UserIcon className="mr-2 h-5 w-5" />
            View Profile
          </Button>

          {/* Show Reject button for All and Approved tabs */}
          {(tabType === 'all' || tabType === 'approved') &&
            status !== EventSubscriptionStatus.REJECTED && (
              <Button
                onClick={handleReject}
                className="h-10 w-full px-4 py-2"
                variant="destructive"
              >
                <XIcon className="mr-2 h-5 w-5" />
                Reject
              </Button>
            )}

          {/* Show Approve button for Rejected tab */}
          {tabType === 'rejected' && (
            <Button
              onClick={handleApprove}
              className="h-10 w-full px-4 py-2"
              variant="default"
            >
              <CheckIcon className="mr-2 h-5 w-5" />
              Approve
            </Button>
          )}
        </div>
      </Card>

      {/* Reject Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {firstName} {lastName} from this
              event? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performRejection}
              className="h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {firstName} {lastName} for this
              event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performApproval}
              className="h-10 bg-primary text-white hover:bg-primary-500"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
