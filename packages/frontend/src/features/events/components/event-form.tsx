'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
      formValues.category_id?.length > 0 &&
      formValues.link?.length > 0;
    return hasValues && !hasErrors;
  } else if (activeStep === 2) {
    const step2Fields = [
      'start_date',
      'start_time',
      'end_time',
      'type',
      'location'
    ];
    const hasErrors = step2Fields.some(
      (field) => formState.errors[field as keyof EventFormValues]
    );
    const hasValues =
      formValues.start_date?.length > 0 &&
      formValues.start_time?.length > 0 &&
      formValues.end_time?.length > 0 &&
      formValues.location?.length > 0;
    return hasValues && !hasErrors;
  }
  return false;
};

// Make EventForm an internal component (no export)
const EventForm = () => {
  const router = useRouter();
  const {
    createEvent,
    editEvent,
    fetchEventForEdit,
    eventForEdit,
    clearEventForEdit
  } = useEventStore();
  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const pathname = usePathname();
  const [activeStep, setActiveStep] = React.useState(1);
  const [isLoadingEvent, setIsLoadingEvent] = React.useState(false);

  const isEdit = pathname.startsWith('/events/edit');
  const eventId = isEdit ? pathname.split('/').pop() : null;
  const eventButtonText = isEdit ? 'Update Event' : 'Publish Event';

  // Fetch event data for editing
  React.useEffect(() => {
    if (isEdit && eventId) {
      const fetchEvent = async () => {
        try {
          setIsLoadingEvent(true);
          await fetchEventForEdit(Number(eventId));
        } catch (error) {
          console.error('Error fetching event for edit:', error);
          showAlert({
            type: 'error',
            title: 'Error Loading Event',
            description:
              'Failed to load event data for editing. Please try again.'
          });
          router.push('/events');
        } finally {
          setIsLoadingEvent(false);
        }
      };
      fetchEvent();
    }

    // Cleanup function to clear event data when component unmounts
    return () => {
      if (isEdit) {
        clearEventForEdit();
      }
    };
  }, [
    isEdit,
    eventId,
    fetchEventForEdit,
    clearEventForEdit,
    showAlert,
    router
  ]);

  const defaultValues = {
    title: eventForEdit?.title || '',
    description: eventForEdit?.description || '',
    category_id: eventForEdit?.category_id?.toString() || '',
    location: eventForEdit?.location || '',
    link: eventForEdit?.link || '',
    is_free: eventForEdit?.is_free ?? true,
    type: eventForEdit?.type || EventsTypes.PUBLIC,
    requires_confirmation: false,
    accept_subscriptions: true,
    start_date: eventForEdit?.start_date || '',
    start_time: eventForEdit?.start_time || '',
    end_time: eventForEdit?.end_time || '',
    file: undefined,
    removeEventImage: false
  };

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  // Update form values when event data is loaded
  React.useEffect(() => {
    if (eventForEdit && isEdit) {
      console.log('EventForm - Loading existing event data:', eventForEdit);
      const newDefaultValues = {
        title: eventForEdit.title || '',
        description: eventForEdit.description || '',
        category_id: eventForEdit.category_id?.toString() || '',
        location: eventForEdit.location || '',
        link: eventForEdit.link || '',
        is_free: eventForEdit.is_free ?? true,
        type: eventForEdit.type || EventsTypes.PUBLIC,
        requires_confirmation: false,
        accept_subscriptions: true,
        start_date: eventForEdit.start_date || '',
        start_time: eventForEdit.start_time || '',
        end_time: eventForEdit.end_time || '',
        file: undefined,
        removeEventImage: false
      };
      console.log('EventForm - Setting form values:', newDefaultValues);
      methods.reset(newDefaultValues);
    }
  }, [eventForEdit, isEdit, methods]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStepNavigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === 1) {
      handleNext();
    }
  };

  const handleFormSubmit = async (data: EventFormValues) => {
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

      // Handle file removal flag
      if (data.removeEventImage) {
        formData.append('removeEventImage', 'true');
        console.log('Event image removal flag added');
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
      if (isEdit && eventForEdit) {
        result = await editEvent(eventForEdit.id, formData);
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

  const handleFinalSubmit = methods.handleSubmit(handleFormSubmit);

  // Show loading state while fetching event data
  if (isLoadingEvent) {
    return (
      <Card className="mx-auto flex w-full max-w-3xl flex-col rounded-[24px]">
        <CardHeader className="justify-center p-6 sm:p-8">
          <CardTitle className="flex flex-col space-y-4 text-center sm:space-y-6">
            <div className="relative flex items-center justify-center gap-2">
              <IconButton
                leftIcon="arrowLeft"
                variant="ghost"
                className="absolute left-0 h-10 w-10"
                onClick={() => router.back()}
              />
              <h2 className="break-words text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
                Loading Event...
              </h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-4 p-4 sm:p-6">
          <div className="flex items-center justify-center p-6 sm:p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex w-full max-w-3xl flex-col rounded-[24px]">
      <AlertDialogUI />
      <CardHeader className="justify-center p-6 sm:p-8">
        <CardTitle className="flex flex-col space-y-4 text-center sm:space-y-6">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="break-words text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
          <h4 className="text-sm leading-snug text-muted-foreground sm:text-base md:text-lg">
            {activeStep === 1 ? 'Event Information' : 'Event Time & Location'}
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 p-4 sm:p-6">
        <FormProvider {...methods}>
          <form
            onSubmit={
              activeStep === 1 ? handleStepNavigation : handleFinalSubmit
            }
            className="space-y-6"
          >
            {activeStep === 1 ? (
              <BaseForm
                onFileSelect={handleFileSelect}
                existingEventImage={eventForEdit?.image}
              />
            ) : (
              <TimeLocationForm existingEventData={eventForEdit} />
            )}
            <div className="flex w-full flex-col gap-3 pt-5 sm:flex-row sm:gap-4">
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
                type="submit"
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
