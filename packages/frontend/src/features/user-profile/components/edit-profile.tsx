import { useState, useCallback, useEffect, useMemo } from 'react';
import Stepper from '@/shared/components/stepper/stepper';
import {
  PersonalInfoForm,
  SocialLinksForm,
  UploadResume,
  GoalsForm
} from './multi-step-form';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from '@/shared/components/ui/card';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from '@/shared/components/ui/icon-button';
import { UserProfileFormData, userProfileSchema } from '../lib/validations';
import { userApi } from '../api/user-api';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store';
import { useFetchProfile } from '../hooks/use-fetch-profile';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';

function getStepContent(step: number) {
  console.log('STEP HERE', step);
  switch (step) {
    case 1:
      return <PersonalInfoForm />;
    case 2:
      return <SocialLinksForm />;
    case 3:
      return <UploadResume />;
    case 4:
      return <GoalsForm />;
    default:
      return 'Unknown step';
  }
}

export const EditProfile = () => {
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();
  const { user } = useUserStore();
  const { isLoading, error } = useFetchProfile();
  const { showAlert } = useAlertDialog();

  const methods = useForm<UserProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(userProfileSchema),
    values: useMemo(
      () => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        province: user?.province || '',
        city: user?.city || '',
        dob: user?.dob || '',
        languages: user?.languages || '',
        profession: user?.profession || '',
        experience: user?.experience || '',
        bio: user?.bio || '',
        pictureUploadLink: user?.pictureUploadLink || '',
        arrivalInCanada: user?.arrivalInCanada || '',
        goalId: user?.goalId || '',
        linkedinLink: user?.linkedinLink || '',
        githubLink: user?.githubLink || '',
        twitterLink: user?.twitterLink || '',
        portfolioLink: user?.portfolioLink || '',
        otherLinks: user?.otherLinks || '',
        additionalLinks: user?.additionalLinks || [],
        workStatus: user?.workStatus || '',
        companyName: user?.companyName || '',
        countryOfOrigin: user?.countryOfOrigin || '',
        ageRange: user?.ageRange || ''
      }),
      [user]
    )
  });

  useEffect(() => {
    console.log('Form Values:', methods.getValues());
    console.log('Form Errors:', methods.formState.errors);
  }, [methods]);

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleNext = async () => {
    // const fieldsToValidate = {
    //   1: [
    //     'firstName',
    //     'lastName',
    //     'province',
    //     'dob',
    //     'ageRange',
    //     'countryOfOrigin'
    //   ],
    //   2: ['languages', 'profession', 'experience', 'skills'],
    //   3: ['pictureUploadLink'],
    //   4: ['bio']
    // }[activeStep];

    // const isValid = await methods.trigger(
    //   fieldsToValidate as (keyof UserProfileFormData)[]
    // );

    // if (isValid) {
    setActiveStep((prevStep) => prevStep + 1);
    // }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: UserProfileFormData) => {
    if (activeStep !== 4) {
      handleNext();
      return;
    }

    try {
      console.log('Submitting data:', data);
      const response = await userApi.updateUserProfile(data, Number(user?.id));

      if (response.success !== true) {
        throw new Error(response.message || 'Failed to update profile');
      }

      showAlert({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        type: 'success'
      });

      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (error) {
      console.error('Submit error:', error);
      showAlert({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="flex w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Error loading profile: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <AlertDialogUI />
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="font-semibold">Update Profile</h2>
          </div>
          <h4 className="font-normal text-neutral-dark-600">
            {activeStep === 1 && 'Personal Information'}
            {activeStep === 2 && 'Social Links'}
            {activeStep === 3 && 'Professional Information'}
            {activeStep === 4 && 'Goals'}
          </h4>
          <Stepper activeStep={activeStep} totalSteps={4} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {getStepContent(activeStep)}
            <div className="flex w-full justify-between pt-5">
              <IconButton
                className="w-[180px]"
                type="button"
                leftIcon="arrowLeft"
                onClick={handleBack}
                variant="outline"
                disabled={activeStep === 1}
                label="Previous"
              />
              <IconButton
                className="w-[180px]"
                type="submit"
                disabled={isSubmitting}
                rightIcon={activeStep === 4 ? undefined : 'arrowRight'}
                label={
                  activeStep === 4
                    ? isSubmitting
                      ? 'Saving...'
                      : 'Finish'
                    : 'Next'
                }
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
