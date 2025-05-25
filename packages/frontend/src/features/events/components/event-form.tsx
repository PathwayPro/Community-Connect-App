'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEventStore } from '../store';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent
} from '@/shared/components/ui/card';
import { BaseForm } from './common/base-form';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import {
  eventFormSchema,
  EventFormValues,
  EventsTypes
} from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimeLocationForm } from './common/time-location-form';
import { UpdateEventDto } from '../dto';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { PermissionWrapper } from '@/shared/components/navigation/permission-wrapper/permission-wrapper';
import { AxiosError } from 'axios';

// Add this before the EventForm component
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
    const hasErrors = step1Fields.some(
      (field) => formState.errors[field as keyof EventFormValues]
    );
    const hasValues =
      formValues.title?.length >= 3 &&
      formValues.description?.length >= 20 &&
      formValues.category_id?.length > 0;
    return hasValues && !hasErrors;
  } else if (activeStep === 2) {
    const step2Fields = ['start_date', 'start_time', 'end_time', 'type'];
    const hasErrors = step2Fields.some(
      (field) => formState.errors[field as keyof EventFormValues]
    );
    const hasValues =
      formValues.start_date?.length > 0 &&
      formValues.start_time?.length > 0 &&
      formValues.end_time?.length > 0;
    return hasValues && !hasErrors;
  }
  return false;
};

// Make EventForm an internal component (no export)
const EventForm = () => {
  const router = useRouter();
  const { createEvent, editEvent } = useEventStore();
  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(1);

  const eventData: UpdateEventDto = searchParams.get('data')
    ? JSON.parse(decodeURIComponent(searchParams.get('data')!))
    : null;

  const isEdit = pathname.startsWith('/events/edit');
  const eventButtonText = isEdit ? 'Update Event' : 'Publish Event';

  const defaultValues = {
    title: eventData?.title || '',
    description: eventData?.description || '',
    category_id: eventData?.category_id?.toString() || '',
    location: eventData?.location || '',
    link: eventData?.link || '',
    is_free: eventData?.is_free ?? true,
    type: eventData?.type || EventsTypes.PUBLIC,
    requires_confirmation: false,
    accept_subscriptions: true,
    start_date: eventData?.start_date || '',
    start_time: eventData?.start_time || '',
    end_time: eventData?.end_time || '',
    file: eventData?.file || undefined
  };

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formData = new FormData();

      // Add file first if it exists
      if (selectedFile) {
        formData.append('file', selectedFile);
        console.log(
          'File added to FormData:',
          selectedFile.name,
          selectedFile.type,
          selectedFile.size
        );
      }

      // Handle start_date - ensure it's properly formatted
      if (data.start_date) {
        const startDate = new Date(data.start_date);
        // Send as ISO string to match the DTO expectation
        formData.append('start_date', startDate.toISOString());
        console.log('start_date added:', startDate.toISOString());
      }

      // Handle link - ensure it has protocol
      if (data.link) {
        const formattedLink = data.link.startsWith('http')
          ? data.link
          : `https://${data.link}`;
        formData.append('link', formattedLink);
        console.log('link added:', formattedLink);
      }

      // Handle category_id - ensure it's a string for FormData
      if (data.category_id) {
        formData.append('category_id', String(data.category_id));
        console.log('category_id added:', data.category_id);
      }

      // Add required fields with proper defaults
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('location', data.location || 'Online');
      formData.append('start_time', data.start_time || '');
      formData.append('end_time', data.end_time || '');
      formData.append('type', data.type || EventsTypes.PUBLIC);

      // Handle boolean values - convert to string for FormData
      formData.append('is_free', String(data.is_free ?? true));
      formData.append(
        'requires_confirmation',
        String(data.requires_confirmation ?? false)
      );
      formData.append(
        'accept_subscriptions',
        String(data.accept_subscriptions ?? true)
      );

      // Log all FormData entries before sending
      console.log('Final FormData contents:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      let result;
      if (isEdit && eventData) {
        result = await editEvent(eventData.id, formData);
        if (result) {
          showAlert({
            type: 'success',
            title: 'Event Updated Successfully!',
            description: 'Your event has been successfully updated.',
            redirect: '/events'
          });
        }
      } else {
        result = await createEvent(formData);
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
      console.error('Form submission error:', error);

      // More detailed error logging
      if (error instanceof AxiosError && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }

      showAlert({
        type: 'error',
        title: isEdit ? 'Event Update Failed' : 'Event Creation Failed',
        description:
          error instanceof AxiosError
            ? error.response?.data?.message
            : error instanceof Error
              ? error.message
              : 'Please check your input and try again.'
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
            {activeStep === 1 ? (
              <BaseForm onFileSelect={handleFileSelect} />
            ) : (
              <TimeLocationForm />
            )}
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

// Named export
export const EventFormWrapper = () => {
  return (
    <PermissionWrapper
      requiredRoles={['ADMIN', 'MENTOR']}
      fallbackRoute="/events"
      permissionDeniedMessage="Only administrators can access this page."
    >
      <EventForm />
    </PermissionWrapper>
  );
};

// Default export
export default EventFormWrapper;
