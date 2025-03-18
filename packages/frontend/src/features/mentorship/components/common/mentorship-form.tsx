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
import { FormProvider, useForm } from 'react-hook-form';
import { useUserStore } from '@/features/user-profile/store';
import { useRouter, usePathname } from 'next/navigation';
import { MentorSchema, mentorSchema } from '../../lib/validations';
import { Button } from '@/shared/components/ui/button';
import { useMentorshipStore } from '../../store';
import { MentorshipAgreementDialog } from './modals/agreement-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@/features/user-profile/types';
import { useFetchProfile } from '@/features/user-profile/hooks/use-fetch-profile';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';

interface MentorshipFormProps {
  title: string;
  description: string;
}

const defaultMentorValues = ({
  user
}: {
  user: Partial<UserProfile>;
}): MentorSchema => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  profession: user?.profession || '',
  max_mentees: 1,
  availability: '',
  has_experience: false,
  experience_details: '',
  resume_upload_link: '',
  interests: [],
  experience: 0
});

export const MentorshipForm = ({ title, description }: MentorshipFormProps) => {
  const pathname = usePathname();
  const isMentor = pathname === '/mentorship/mentor';
  const router = useRouter();
  const { createMentor, interests, fetchInterests } = useMentorshipStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hasAgreed, setHasAgreed] = React.useState(false);
  const { user } = useUserStore();
  const { isLoading, error } = useFetchProfile();
  const { showAlert } = useAlertDialog();

  console.log('user details', user);

  const methods = useForm<MentorSchema>({
    mode: 'onChange',
    resolver: zodResolver(mentorSchema),
    defaultValues: defaultMentorValues({ user: user || {} })
  });

  React.useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const onSubmit = async (data: MentorSchema) => {
    try {
      const modifiedData = {
        ...data,
        has_experience: Boolean(data.experience_details),
        experience: Number(data.experience),
        firstName: '',
        lastName: '',
        profession: ''
      };

      await createMentor(modifiedData);

      showAlert({
        type: 'success',
        title: 'Applied Successfully!',
        description:
          'Your application has been successfully submitted and is currently under review.'
      });

      setTimeout(() => {
        router.push('/mentorship/waitlist');
      }, 3000);
    } catch (error) {
      console.log('error', error);
      showAlert({
        type: 'error',
        title: 'Application Submission Failed',
        description: 'Please check your internet connection and try again.'
      });
    }
  };

  // loading state
  if (isLoading) {
    return (
      <Card className="flex w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Loading {title} form...
        </CardContent>
      </Card>
    );
  }

  // error state
  if (error) {
    return (
      <Card className="flex w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Error loading {title} form: {error.message}
        </CardContent>
      </Card>
    );
  }

  // success state
  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="font-semibold">{title}</h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <BaseForm
              isMentor={isMentor}
              interests={interests}
              experienceDetails={description}
            />
            <div className="flex w-full flex-col gap-4 pt-5">
              <Button
                variant="link"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                View Mentorship Program Agreement to Proceed
              </Button>
              <IconButton
                className="w-full"
                type="submit"
                disabled={methods.formState.isSubmitting || !hasAgreed}
                rightIcon="arrowRight"
                label={
                  methods.formState.isSubmitting
                    ? 'Saving...'
                    : 'Submit Application'
                }
              />
            </div>
          </form>
        </FormProvider>

        <MentorshipAgreementDialog
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          hasAgreed={hasAgreed}
          onAgreementChange={setHasAgreed}
          title={title}
        />
      </CardContent>
    </Card>
  );
};

export default MentorshipForm;
