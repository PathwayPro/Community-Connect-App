import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { EventFormValues, EventTicketTypes } from '../../lib/validation';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { useEventStore } from '../../store';
import { handleLinkChange } from '@/shared/lib/utils';

const ticketTypeOptions = [
  {
    value: EventTicketTypes.FREE,
    label: 'Free Event'
  },
  {
    value: EventTicketTypes.PAID,
    label: 'Paid Event'
  }
];

export const BaseForm = () => {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<EventFormValues>();

  const { eventCategories, fetchEventCategories } = useEventStore();

  console.log('eventCategories', eventCategories);

  useEffect(() => {
    fetchEventCategories();
  }, [fetchEventCategories]);

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
          customError={errors.title?.message}
          required
        />
      </div>
      <div className="flex w-full gap-4">
        <FormSelect
          name="category_id"
          label="Event Category"
          placeholder="Select event category"
          customError={errors.category_id?.message}
          options={eventCategories?.map((category) => ({
            value: String(category.id),
            label: category.name
          }))}
          required
        />
      </div>

      <FormTextarea
        name="description"
        label="Event Description"
        placeholder="Describe your event..."
        customError={errors.description?.message}
        maxLength={400}
        required
      />

      <div className="flex w-full gap-4">
        <CustomSwitch
          name="price"
          label="Free or Paid Event"
          options={ticketTypeOptions}
          value={watch('price')}
          onChange={(value) => setValue('price', value)}
          required
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="link"
          label="Registration Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Registration link URL"
          customError={errors.link?.message}
          onChange={(e) => setValue('link', handleLinkChange(e.target.value))}
        />
      </div>
    </div>
  );
};
