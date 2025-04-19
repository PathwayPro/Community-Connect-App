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
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
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
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';

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

// Move checkStepValidity outside the component to prevent recreation on each render
const checkStepValidity = (
  formValues: EventFormValues,
  activeStep: number,
  formState: UseFormReturn<EventFormValues>['formState']
) => {
  if (activeStep === 1) {
    const step1Fields = [
      'title',
      'description',
      'category_id',
      'link',
      'is_free'
    ];

    // Check if all required fields for step 1 are valid
    const hasErrors = step1Fields.some(
      (field) => formState.errors[field as keyof EventFormValues]
    );

    // Check if all required fields have values
    const hasValues =
      formValues.title?.length >= 3 &&
      formValues.description?.length >= 20 &&
      formValues.category_id?.length > 0;

    return hasValues && !hasErrors;
  } else if (activeStep === 2) {
    const step2Fields = [
      'start_date',
      'start_time',
      'end_time',
      'type',
      'requires_confirmation',
      'accept_subscriptions'
    ];

    // Check if required fields for step 2 are valid
    const hasErrors = step2Fields.some(
      (field) => formState.errors[field as keyof EventFormValues]
    );

    // Check if all required fields for step 2 have values
    const hasValues =
      formValues.start_date?.length > 0 &&
      formValues.start_time?.length > 0 &&
      formValues.end_time?.length > 0;

    return hasValues && !hasErrors;
  }

  return false;
};

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

  const [activeStep, setActiveStep] = React.useState(1);

  const defaultValues = {
    title: eventData?.title || '',
    subtitle: eventData?.subtitle || '',
    description: eventData?.description || '',
    category_id: eventData?.category_id?.toString() || '',
    location: eventData?.location || '',
    link: eventData?.link || '',
    is_free: eventData?.is_free ?? true,
    type: eventData?.type || EventsTypes.PUBLIC,
    requires_confirmation: eventData?.requires_confirmation ?? false,
    accept_subscriptions: eventData?.accept_subscriptions ?? true,
    start_date: eventData?.start_date || '',
    start_time: eventData?.start_time || '',
    end_time: eventData?.end_time || ''
  };

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
    mode: 'onChange' // Enable validation on change for better user feedback
  });

  // // Set up data in edit mode
  // useEffect(() => {
  //   if (isEdit && eventData) {
  //     Object.entries(eventData).forEach(([key, value]) => {
  //       if (key === 'category_id') {
  //         methods.setValue(key, String(value), { shouldValidate: true });
  //       } else if (value !== undefined) {
  //         methods.setValue(key as keyof EventFormValues, value, {
  //           shouldValidate: true
  //         });
  //       }
  //     });
  //   }
  // }, [eventData]);

  // const [isCurrentStepValid, setIsCurrentStepValid] = React.useState(false);

  // // Update the useEffect to use the external checkStepValidity function
  // useEffect(() => {
  //   const formValues = methods.getValues();
  //   setIsCurrentStepValid(
  //     checkStepValidity(
  //       formValues as EventFormValues,
  //       activeStep,
  //       methods.formState
  //     )
  //   );
  // }, [activeStep]);

  // // Update the data setting logic in the edit mode useEffect
  // useEffect(() => {
  //   if (isEdit && eventData && !methods.formState.isDirty) {
  //     const updates = Object.entries(eventData).reduce((acc, [key, value]) => {
  //       if (key === 'category_id') {
  //         acc[key] = String(value);
  //       } else if (value !== undefined) {
  //         acc[key as keyof EventFormValues] = value;
  //       }
  //       return acc;
  //     }, {} as Partial<EventFormValues>);

  //     methods.reset(updates);
  //   }
  // }, [eventData]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  console.log('activeStep', activeStep);

  const onSubmit = async (data: EventFormValues) => {
    console.log('data', data);
    try {
      const formattedData = {
        ...data,
        category_id: Number(data.category_id),
        type: data.type as EventType,
        start_date: new Date(`${data.start_date}, ${year}`).toISOString()
      };

      if (isEdit && eventData) {
        const result = await editEvent(eventData.id, {
          ...formattedData,
          id: eventData.id
        });

        if (result) {
          showAlert({
            type: 'success',
            title: 'Event Updated Successfully!',
            description: 'Your event has been successfully updated.',
            redirect: '/events'
          });
        }
      } else {
        const result = await createEvent(formattedData);

        if (result) {
          showAlert({
            type: 'success',
            title: 'Event Created Successfully!',
            description: 'Your event has been successfully created.',
            redirect: '/events'
          });
        }
      }
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
            <h2 className="font-semibold">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
          <h4>
            {activeStep === 1 ? 'Event Information' : 'Event Time & Location'}
          </h4>
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
                type={activeStep === 2 ? 'submit' : 'button'}
                disabled={
                  methods.formState.isSubmitting ||
                  !checkStepValidity(
                    methods.getValues(),
                    activeStep,
                    methods.formState
                  )
                }
                rightIcon="arrowRight"
                label={activeStep === 1 ? 'Next' : eventButtonText}
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
