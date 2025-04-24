import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Link, PenBox, Trash2 } from 'lucide-react';
import { OpportunityResponseDto } from '../../dto/opportunity-dto';
import { useRouter } from 'next/navigation';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { DeleteModal } from '../../../../shared/components/modal/delete-modal';
import { useResourcesStore } from '../../store';
import { useState } from 'react';

interface ExpandedJobCardProps {
  opportunity: OpportunityResponseDto;
  onApply: () => void;
}

export function ExpandedJobCard({
  opportunity,
  onApply
}: ExpandedJobCardProps) {
  const router = useRouter();
  const location = `${opportunity.city}, ${opportunity.province}`;
  const salaryRange = `$${opportunity.salary_range.from.toLocaleString()} - $${opportunity.salary_range.to.toLocaleString()}`;

  const formData = {
    id: opportunity.id,
    job: opportunity.job,
    company: opportunity.company,
    province: opportunity.province,
    city: opportunity.city,
    salary_range_id: opportunity.salary_range_id,
    description: opportunity.description,
    link_post: opportunity.link_post,
    link_apply: opportunity.link_apply,
    settings: opportunity.settings,
    experience: opportunity.experience,
    file: opportunity.file
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteResource } = useResourcesStore();
  const { showAlert } = useAlertDialog();

  const handleEdit = () => {
    router.push(
      `/resources/edit/${opportunity.id}?mode=opportunities&data=${encodeURIComponent(
        JSON.stringify(formData)
      )}`
    );
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!opportunity.id) return;
    try {
      setIsDeleting(true);
      await deleteResource(opportunity.id);
      showAlert({
        title: 'Success',
        description: 'Opportunity deleted successfully',
        type: 'success',
        redirect: '/resources'
      });
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      showAlert({
        title: 'Error',
        description: 'An error occurred while deleting the opportunity',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card className="relative w-full min-w-full bg-neutral-light-100 p-4">
      <AlertDialogUI />
      <DeleteModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Opportunity"
        description="Are you sure you want to delete this opportunity? This action cannot be undone."
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="absolute top-0 h-[70px] w-full shrink-0 rounded-t-xl bg-primary-200" />

        {/* Action Buttons */}
        <div className="absolute right-4 top-1 z-20 flex gap-3">
          <div
            className="cursor-pointer rounded-full bg-primary p-2 hover:bg-secondary"
            onClick={handleEdit}
          >
            <PenBox className="h-4 w-4 text-white" />
          </div>
          <div
            className="cursor-pointer rounded-full bg-primary p-2 hover:bg-destructive"
            onClick={handleDelete}
          >
            <Trash2
              className={`h-4 w-4 text-white ${isDeleting ? 'animate-spin' : ''}`}
            />
          </div>
        </div>

        {/* Company Avatar */}
        <Avatar className="h-24 w-24 border border-neutral-light-500 bg-white">
          <AvatarImage
            src={opportunity.file?.name}
            alt={`${opportunity.company} logo`}
          />
          <AvatarFallback>{opportunity.company[0]}</AvatarFallback>
        </Avatar>

        {/* Job Title */}
        <h5>{opportunity.job}</h5>

        {/* Company Name */}
        <span className="paragraph-lg text-muted-foreground">
          {opportunity.company}
        </span>

        {/* Job Details */}
        <div className="flex items-center justify-start gap-6 py-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            <span>Experience</span>
            <p className="paragraph-lg">
              {opportunity.experience || 'Not specified'}
            </p>
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
            <p className="paragraph-lg">
              {opportunity.settings?.toString() || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div className="w-full rounded-xl bg-neutral-light-200 p-4">
          <h6 className="self-start font-semibold">Job Description</h6>
          <ScrollArea className="h-[250px]">
            <p className="paragraph-lg whitespace-pre-wrap">
              {opportunity.description}
            </p>
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
