'use client';

import React from 'react';
import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent
} from '@/shared/components/ui/card';
import { BaseForm } from './common/base-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { eventFormSchema, EventFormValues } from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { useEventStore } from '../store';
import { TimeLocationForm } from './common/time-location-form';

function getStepContent(step: number) {
  switch (step) {
    case 1:
      return <BaseForm />;
    case 2:
      return <TimeLocationForm />;
    default:
      return 'Unknown step';
  }
}

const defaultEventValues = (): EventFormValues => ({
  title: '',
  subtitle: '',
  description: '',
  category_id: 0,
  location: '',
  link: '',
  image: '',
  price: 0,
  type: 'PUBLIC',
  requires_confirmation: false,
  accept_subscriptions: true
});

export const EventForm = () => {
  const router = useRouter();
  const { createEvent, fetchEvents } = useEventStore();
  const { showAlert } = useAlertDialog();

  const [events, setEvents] = React.useState<
    Array<{ id: number; name: string }>
  >([]);

  const [activeStep, setActiveStep] = React.useState(1);

  const methods = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventValues()
  });

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      await createEvent(data);

      showAlert({
        type: 'success',
        title: 'Event Created Successfully!',
        description: 'Your event has been successfully created.'
      });

      setTimeout(() => {
        router.push('/events');
      }, 3000);
    } catch (error) {
      console.error('error', error);
      showAlert({
        type: 'error',
        title: 'Event Creation Failed',
        description: 'Please check your input and try again.'
      });
    }
  };

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <h2 className="font-semibold">Create New Event</h2>
          <h4>Event Information</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {getStepContent(activeStep)}
            <div className="flex w-full gap-4 pt-5">
              {activeStep === 2 && (
                <IconButton
                  className="w-full"
                  disabled={methods.formState.isSubmitting}
                  rightIcon="arrowLeft"
                  label="Previous"
                  variant="outline"
                  onClick={handlePrevious}
                />
              )}
              <IconButton
                className="w-full"
                type={activeStep === 2 ? 'submit' : 'button'}
                disabled={methods.formState.isSubmitting}
                rightIcon="arrowRight"
                label={activeStep === 1 ? 'Next' : 'Publish Event'}
                onClick={activeStep === 1 ? handleNext : undefined}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default EventForm;
