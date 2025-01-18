'use client';

import React from 'react';
import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent
} from '@/shared/components/ui/card';
import { BaseForm } from './base-form';
import { FormProvider } from 'react-hook-form';
import { UserProfileFormData } from '@/features/user-profile/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/features/auth/providers/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { mentorSchema } from '../../lib/validations';
import { userApi } from '@/features/user-profile/api/user-api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';

interface MentorshipFormProps {
  title: string;
}

const MentorshipForm = ({ title }: MentorshipFormProps) => {
  const pathname = usePathname();
  const isMentor = pathname === '/mentorship/mentor';
  const router = useRouter();

  const { user } = useAuthContext();

  const methods = useForm<UserProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(mentorSchema),
    defaultValues: React.useMemo(() => {
      const mentor = {
        max_mentees: 1,
        availability:
          'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
        has_experience: false,
        experience_details: '',
        status: 'PENDING',
        user_id: user?.id,
        resume_upload_link: ''
      };

      return {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        profession: user?.profession || '',
        experience: user?.experience || '',
        max_mentees: mentor.max_mentees,
        availability: mentor.availability,
        has_experience: mentor.has_experience,
        experience_details: mentor.experience_details,
        status: mentor.status,
        resume_upload_link: mentor.resume_upload_link
      };
    }, [user])
  });

  // Add form state logging for debugging
  React.useEffect(() => {
    console.log('Form Values:', methods.getValues());
    console.log('Form Errors:', methods.formState.errors);
  }, [methods]);

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data: UserProfileFormData) => {
    // Ensure type conversion before submission
    const modifiedData = {
      ...data,
      dob: data.dob ? new Date(data.dob) : undefined
    };

    try {
      console.log('Submitting data:', modifiedData);

      const response = await userApi.updateUserProfile(
        modifiedData,
        Number(user?.id)
      );

      if (response.success === false) {
        console.error('Server response:', response);
        throw new Error(response.message || 'Failed to update profile');
      }

      const result = response.data;
      console.log('Submit success:', result);
      toast.success('Profile updated successfully');
      router.push('/profile');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hasAgreed, setHasAgreed] = React.useState(false);

  const agreementContent = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    1. First Agreement Point
    2. Second Agreement Point
    3. Third Agreement Point

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    // Add more agreement content as needed
  `;

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <h2 className="font-semibold">{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BaseForm isMentor={isMentor} />
            <div className="flex w-full flex-col gap-4 pt-5">
              <Button
                variant="link"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                View Application Agreement to Proceed
              </Button>
              <IconButton
                className="w-full"
                type="submit"
                disabled={isSubmitting || !hasAgreed}
                rightIcon={'arrowRight'}
                label={isSubmitting ? 'Saving...' : 'Submit Application'}
              />
            </div>
          </form>
        </FormProvider>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Application Agreement</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="whitespace-pre-line">{agreementContent}</div>
            </ScrollArea>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreement"
                  checked={hasAgreed}
                  onCheckedChange={(checked) =>
                    setHasAgreed(checked as boolean)
                  }
                />
                <label
                  htmlFor="agreement"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MentorshipForm;
