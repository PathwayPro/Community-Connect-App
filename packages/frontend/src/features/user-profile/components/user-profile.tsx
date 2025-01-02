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
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { IconButton } from '@/shared/components/ui/icon-button';

function getStepContent(step: number) {
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

// Add interface for form data
interface UserProfileFormData {
  personalInfo: {
    name: string;
    email: string;
    // ... other personal info fields
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    // ... other social links
  };
  resume?: File;
  goals: {
    // ... goal related fields
  };
}

const UserProfile = () => {
  const [activeStep, setActiveStep] = useState(1);
  const methods = useForm<UserProfileFormData>({
    mode: 'onChange'
  });
  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      // Handle form submission
      console.log('saved form data :', data);
      //   await saveUserProfile(data);
      // Show success notification
    } catch (error) {
      // Handle error
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <h2 className="font-semibold">Update Profile</h2>
          <h4 className="font-normal text-neutral-dark-600">
            {activeStep === 1 && 'Personal Information'}
            {activeStep === 2 && 'Social Links'}
            {activeStep === 3 && 'Resume Upload'}
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
                leftIcon="arrowLeft"
                onClick={handleBack}
                variant="outline"
                disabled={activeStep === 1}
                label="Previous"
              />
              {activeStep === 4 ? (
                <IconButton
                  className="w-[180px]"
                  type="submit"
                  disabled={isSubmitting}
                  label={isSubmitting ? 'Saving...' : 'Finish'}
                />
              ) : (
                <IconButton
                  className="w-[180px]"
                  rightIcon="arrowRight"
                  onClick={handleNext}
                  label="Next"
                />
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
