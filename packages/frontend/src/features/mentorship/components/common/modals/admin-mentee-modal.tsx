import { cn } from '@/shared/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { FileText, MessageSquare, Download } from 'lucide-react';
import { Mentee } from '../../../types';
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
import { PdfPreviewModal } from '@/shared/components/pdf/pdf-preview-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { mentorshipApi } from '../../../api/mentorship-api';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';

interface AdminMenteeModalCardProps {
  data: Mentee;
  onStatusUpdate?: () => void; // Add callback to refresh data
}

export const AdminMenteeModalCard = ({
  data,
  onStatusUpdate
}: AdminMenteeModalCardProps) => {
  const {
    identity,
    profession,
    experience,
    email,
    reason,
    resume,
    status,
    menteeApplicationId // Add this
  } = data;
  const [isOpen, setIsModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    status || 'PENDING'
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { showAlert } = useAlertDialog();

  const handleViewResume = () => {
    if (resume) {
      setIsResumeModalOpen(true);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === status || !menteeApplicationId) return;

    setIsUpdatingStatus(true);
    try {
      await mentorshipApi.updateMenteeStatus(
        menteeApplicationId,
        selectedStatus
      );

      showAlert({
        type: 'success',
        title: 'Status Updated',
        description: `Mentee status has been updated to ${selectedStatus}.`
      });

      // Refresh the data
      onStatusUpdate?.();
      setIsModalOpen(false);
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Update Failed',
        description: 'Failed to update mentee status. Please try again.'
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const resumeActions = [
    {
      label: 'Close',
      onClick: () => setIsResumeModalOpen(false),
      variant: 'outline' as const
    },
    ...(resume
      ? [
          {
            label: 'Download Resume',
            href: resume.startsWith('http')
              ? resume
              : `${process.env.NEXT_PUBLIC_API_URL}/files/${resume}`,
            variant: 'default' as const,
            icon: <Download className="h-6 w-6" />,
            external: true
          }
        ]
      : [])
  ];

  const isApproved = status?.toString().toLowerCase() === 'approved';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-[90px] hover:bg-primary hover:text-white"
          >
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="flex h-[85dvh] w-[92vw] max-w-[95vw] flex-col rounded-3xl p-4 sm:h-auto sm:w-[552px] sm:max-w-[552px] sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold sm:text-2xl">
              Mentee Profile
            </DialogTitle>
            <DialogDescription className="sr-only">
              View the mentee profile.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 rounded-3xl bg-neutral-light-300 p-3 sm:p-4">
            <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-light-500 bg-white p-6">
              <div
                className={cn(
                  'absolute top-0 h-[70px] w-full rounded-t-2xl bg-primary-200'
                )}
              />

              <Avatar className="h-20 w-20 border-4 border-white bg-warning-500">
                <AvatarImage
                  src={identity.avatar}
                  alt="Mentee avatar"
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
                <p className="mb-6 text-sm text-neutral-dark-100">
                  {profession}
                </p>

                <p className="text-sm text-neutral-dark-100">
                  Email: <span className="text-neutral-dark-600"> {email}</span>
                </p>

                <p className="text-sm text-neutral-dark-100">
                  Experience:{' '}
                  <span className="text-neutral-dark-600">
                    {' '}
                    {experience || 'Not specified'}
                  </span>
                </p>

                <p className="flex flex-col space-x-2 text-sm text-neutral-dark-100">
                  <span>Why do you want to be mentored?</span>
                  <span className="text-neutral-dark-600">{reason}</span>
                </p>
              </div>

              <div className="flex w-full gap-2">
                <Button variant="outline" className="h-10 flex-1 gap-2 px-0">
                  <MessageSquare className="h-5 w-5" />
                  Message
                </Button>
                <Button
                  className="h-10 flex-1 gap-2 px-0"
                  onClick={handleViewResume}
                  variant="outline"
                  disabled={!resume}
                >
                  <FileText className="h-5 w-5" />
                  View Resume
                </Button>
              </div>
            </div>
          </div>

          {/* Status Management Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Status:</span>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus || selectedStatus === status}
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
            {isApproved ? (
              <Button
                className="mx-auto h-10 w-full"
                onClick={() => console.log('match with mentor')}
              >
                Match with a Mentor
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Preview Modal */}
      {resume && (
        <PdfPreviewModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          title={`${identity.firstName} ${identity.lastName}'s Resume`}
          description="Preview and download the resume"
          height="h-full"
          filePath={
            resume.startsWith('http')
              ? resume
              : `${process.env.NEXT_PUBLIC_API_URL}/files/${resume}`
          }
          actions={resumeActions}
        />
      )}
    </>
  );
};
