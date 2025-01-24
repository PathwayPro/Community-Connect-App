import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { EventFormValues, EventsTypes } from '../../lib/validation';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';

const ticketTypeOptions = [
  {
    value: EventsTypes.PUBLIC,
    label: 'Public Event'
  },
  {
    value: EventsTypes.PRIVATE,
    label: 'Private Event'
  }
];

export const BaseForm = () => {
  const { setValue, watch } = useFormContext<EventFormValues>();

  const handleImageUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      toast.success('Event image uploaded successfully');

      //   const response = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: formData
      //   });

      //   if (!response.ok) throw new Error('Upload failed');

      //   const { urls } = await response.json();
      //   setValue('image', urls[0], { shouldValidate: true });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload event image');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload Event Image"
        maxSize={5}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handleImageUpload}
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="title"
          label="Event Title"
          placeholder="Enter event title"
          customError="Event title is required"
          required
        />
      </div>
      <div className="flex w-full gap-4">
        <FormInput
          name="category"
          label="Event Category"
          placeholder="Enter event category"
          customError="Event category is required"
          required
        />
      </div>

      <FormTextarea
        name="description"
        label="Event Description"
        placeholder="Describe your event..."
        customError="Event description is required"
        maxLength={400}
        required
      />

      <div className="flex w-full gap-4">
        <CustomSwitch
          name="ticket_type"
          label="Ticket Type"
          options={ticketTypeOptions}
          value={watch('type')}
          onChange={(value) => setValue('type', value)}
          required
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="registratom_link"
          label="Registration Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Link text"
        />
      </div>
    </div>
  );
};
