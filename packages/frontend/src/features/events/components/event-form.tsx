'use client';

import React, { useEffect, useCallback } from 'react';
import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent
} from '@/shared/components/ui/card';
import { BaseForm } from './common/base-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  eventFormSchema,
  EventFormValues,
  EventsTypes
} from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { useEventStore } from '../store';
import { TimeLocationForm } from './common/time-location-form';
import { EventType } from '../types';
import { UpdateEventDto } from '../dto';
import { year } from '../lib/constants';

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

export const EventForm = () => {
  const router = useRouter();
  const { createEvent, editEvent } = useEventStore();
  const { showAlert } = useAlertDialog();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const eventData: UpdateEventDto = searchParams.get('data')
    ? JSON.parse(decodeURIComponent(searchParams.get('data')!))
    : null;

  // Get the state from router if it exists
  const isEdit = pathname.startsWith('/events/edit');

  const eventButtonText = isEdit ? 'Update Event' : 'Publish Event';

  console.log('isEdit', eventData);

  const [activeStep, setActiveStep] = React.useState(1);

  const defaultEventValues = (): EventFormValues => {
    if (isEdit && eventData) {
      return {
        title: eventData.title || '',
        subtitle: eventData.subtitle || '',
        description: eventData.description || '',
        category_id: eventData.category_id?.toString() || '',
        location: eventData.location || '',
        link: eventData.link || '',
        image: eventData.image || '',
        is_free: eventData.is_free || true,
        type: eventData.type || EventsTypes.PUBLIC,
        requires_confirmation: eventData.requires_confirmation || false,
        accept_subscriptions: eventData.accept_subscriptions || true,
        start_date: eventData.start_date || new Date().toISOString(),
        start_time: eventData.start_time || '00:00 AM',
        end_time: eventData.end_time || '00:00 AM'
      };
    }

    return {
      title: '',
      subtitle: '',
      description: '',
      category_id: '',
      location: '',
      link: '',
      image: '',
      is_free: true,
      type: EventsTypes.PUBLIC,
      requires_confirmation: false,
      accept_subscriptions: true,
      start_date: '',
      start_time: '00:00 AM',
      end_time: '00:00 AM'
    };
  };

  const methods = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventValues()
  });

  const { trigger } = methods;

  // Function to check if current step is valid
  const isStepValid = useCallback(async () => {
    const fieldsToValidate =
      activeStep === 1
        ? (['title', 'category_id', 'description'] as const)
        : (['start_date', 'type'] as const);

    const result = await trigger(fieldsToValidate);
    return result;
  }, [activeStep, trigger]);

  const [isCurrentStepValid, setIsCurrentStepValid] = React.useState(false);

  // Update step validity whenever fields change
  useEffect(() => {
    isStepValid().then((valid) => setIsCurrentStepValid(valid));
  }, [methods.formState.isDirty, methods.formState.errors, isStepValid]);

  const handleNext = async () => {
    const isValid = await isStepValid();
    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: EventFormValues) => {
    console.log('data', data.start_date);
    try {
      const formattedData = {
        ...data,
        category_id: Number(data.category_id),
        type: data.type as EventType,
        start_date: new Date(`${data.start_date}, ${year}`).toISOString()
      };

      console.log('formattedData', formattedData);

      if (isEdit && eventData) {
        await editEvent(eventData.id, { ...formattedData, id: eventData.id });
        showAlert({
          type: 'success',
          title: 'Event Updated Successfully!',
          description: 'Your event has been successfully updated.'
        });
      } else {
        await createEvent(formattedData);
        showAlert({
          type: 'success',
          title: 'Event Created Successfully!',
          description: 'Your event has been successfully created.'
        });
      }

      setTimeout(() => {
        router.push('/events');
      }, 3000);
    } catch (error) {
      console.error('error', error);
      showAlert({
        type: 'error',
        title: isEdit ? 'Event Update Failed' : 'Event Creation Failed',
        description: 'Please check your input and try again.'
      });
    }
  };

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
            <h2 className="font-semibold">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
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
                  type="button"
                  disabled={methods.formState.isSubmitting}
                  rightIcon="arrowLeft"
                  label="Previous"
                  variant="outline"
                  onClick={handlePrevious}
                />
              )}
              <IconButton
                className="w-full"
                type="button"
                disabled={!isCurrentStepValid}
                rightIcon="arrowRight"
                label={activeStep === 1 ? 'Next' : eventButtonText}
                onClick={
                  activeStep === 1 ? handleNext : methods.handleSubmit(onSubmit)
                }
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default EventForm;
