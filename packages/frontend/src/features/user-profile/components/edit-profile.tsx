import { useState, useEffect, useMemo } from 'react';
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
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store';
import { useFetchProfile } from '../hooks/use-fetch-profile';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { SkillsResponse, UserProfile } from '../types';
import { toast } from 'sonner';

function getStepContent(
  step: number,
  skills: SkillsResponse[],
  onProfilePictureUpload: (files: File[]) => Promise<void>,
  onResumeUpload: (files: File[]) => Promise<void>
) {
  console.log('STEP HERE', step);
  switch (step) {
    case 1:
      return (
        <PersonalInfoForm onProfilePictureUpload={onProfilePictureUpload} />
      );
    case 2:
      return <SocialLinksForm />;
    case 3:
      return <UploadResume skills={skills} onResumeUpload={onResumeUpload} />;
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
  const { skills, updateUser, fetchSkills } = useUserStore();
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState<File | null>(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
    null
  );

  const methods = useForm<UserProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      province: '',
      city: '',
      dob: '',
      ageRange: '',
      languages: '',
      profession: '',
      experience: '',
      bio: '',
      pictureUploadLink: undefined,
      arrivalInCanada: '',
      goalId: '',
      linkedinLink: '',
      githubLink: '',
      twitterLink: '',
      portfolioLink: '',
      otherLinks: '',
      additionalLinks: [],
      workStatus: '',
      companyName: '',
      countryOfOrigin: '',
      activelySearching: false,
      skills: [],
      resumeUploadLink: undefined
    }
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        province: user.province || '',
        city: user.city || '',
        dob: user.dob || '',
        ageRange: user.ageRange || '',
        languages: user.languages || '',
        profession: user.profession || '',
        experience: user.experience || '',
        bio: user.bio || '',
        pictureUploadLink: user.pictureUploadLink || undefined,
        arrivalInCanada: user.arrivalInCanada || '',
        goalId: user.goalId || '',
        linkedinLink: user.linkedinLink || '',
        githubLink: user.githubLink || '',
        twitterLink: user.twitterLink || '',
        portfolioLink: user.portfolioLink || '',
        otherLinks: user.otherLinks || '',
        additionalLinks: user.additionalLinks || [],
        workStatus: user.workStatus || '',
        companyName: user.companyName || '',
        countryOfOrigin: user.countryOfOrigin || '',
        activelySearching: user.activelySearching || false,
        skills: user.skills?.map(Number) || [],
        resumeUploadLink: user.resumeUploadLink || undefined
      });
    }
  }, [user, methods]);

  useEffect(() => {
    console.log('Form Values:', methods.getValues());
    console.log('Form Errors:', methods.formState.errors);
    fetchSkills();
  }, [methods, fetchSkills]);

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleNext = async () => {
    const fieldsToValidate = {
      1: [
        'firstName',
        'lastName',
        'province',
        'city',
        'dob',
        'ageRange',
        'countryOfOrigin',
        'languages',
        'bio'
      ],
      2: [],
      3: ['profession', 'experience', 'workStatus'],
      4: []
    }[activeStep];

    let isValid = true;

    if (fieldsToValidate && fieldsToValidate.length > 0) {
      isValid = await methods.trigger(
        fieldsToValidate as (keyof UserProfileFormData)[]
      );
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error('Please fill in all required fields before continuing.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleProfilePictureUpload = async (files: File[]) => {
    try {
      if (files && files.length > 0) {
        setSelectedProfilePictureFile(files[0]);
        // Update form value to trigger validation
        methods.setValue('pictureUploadLink', files[0], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        toast.success('Profile picture uploaded successfully');
      } else {
        setSelectedProfilePictureFile(null);
        methods.setValue('pictureUploadLink', undefined);
        toast.error('No file selected.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const handleResumeUpload = async (files: File[]) => {
    try {
      if (files && files.length > 0) {
        setSelectedResumeFile(files[0]);
        // Update form value to trigger validation
        methods.setValue('resumeUploadLink', files[0], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        toast.success('Resume uploaded successfully');
      } else {
        setSelectedResumeFile(null);
        methods.setValue('resumeUploadLink', undefined);
        toast.error('No file selected.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload resume');
    }
  };

  const onSubmit = async (data: UserProfileFormData) => {
    if (activeStep !== 4) {
      handleNext();
      return;
    }

    try {
      console.log('Form data to submit:', data);

      // Create FormData for file upload
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            // Handle file uploads directly from form data
            formData.append(key, value);
            console.log(`Appending file ${key}:`, value.name);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
            console.log(`Appending array ${key}:`, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, String(value));
            console.log(`Appending boolean ${key}:`, value);
          } else {
            formData.append(key, String(value));
            console.log(`Appending ${key}:`, value);
          }
        }
      });

      // Log the form data for debugging
      const formDataObj = Object.fromEntries(formData.entries());
      console.log('Final FormData contents:', formDataObj);

      const response = await updateUser(formData, Number(user?.id));

      if (response.success !== true) {
        throw new Error(response.message || 'Failed to update profile');
      }

      showAlert({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        type: 'success',
        redirect: '/profile'
      });
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
            {getStepContent(
              activeStep,
              skills,
              handleProfilePictureUpload,
              handleResumeUpload
            )}
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
