import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { EventFormValues, FreePaidOptions } from '../../lib/validation';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { useEventStore } from '../../store';

interface BaseFormProps {
  onFileSelect?: (file: File | null) => void;
  existingEventImage?: string;
}

export const BaseForm = ({
  onFileSelect,
  existingEventImage
}: BaseFormProps) => {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<EventFormValues>();

  const { eventCategories, fetchEventCategories } = useEventStore();
  const [removeEventImage, setRemoveEventImage] = useState(false);

  useEffect(() => {
    fetchEventCategories();
  }, [fetchEventCategories]);

  const handleImageUpload = async (files: File[]) => {
    try {
      if (files && files.length > 0) {
        const file = files[0];

        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          toast.error(
            'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
          );
          return;
        }

        if (file.size > maxSize) {
          toast.error('File size too large. Maximum size is 5MB.');
          return;
        }

        // Pass the file to parent component
        if (onFileSelect) {
          onFileSelect(file);
        }
        // Set a temporary value for form validation
        setValue('file', file, { shouldValidate: true });
        setRemoveEventImage(false); // Reset removal flag when new file is uploaded
        toast.success('Event image uploaded successfully');
      } else {
        if (onFileSelect) {
          onFileSelect(null);
        }
        setValue('file', null, { shouldValidate: true });
        toast.error('No file selected.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload event image');
    }
  };

  const handleFileRemove = () => {
    // Clear the form value when existing file is removed
    setValue('file', null, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    // Set removal flag for backend
    setRemoveEventImage(true);

    // Store removal flag in form data
    setValue('removeEventImage', true, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });

    toast.success('Event image removed');
  };

  // Prepare existing file for display
  const existingFiles =
    existingEventImage && !removeEventImage
      ? [
          {
            name: existingEventImage.split('/').pop() || 'event-image',
            url: existingEventImage.startsWith('http')
              ? existingEventImage
              : `${process.env.NEXT_PUBLIC_API_URL}/files/${existingEventImage}`,
            type: 'image/jpeg', // Default type, could be enhanced to detect actual type
            size: 0
          }
        ]
      : [];

  // Debug logging
  console.log('BaseForm - existingEventImage:', existingEventImage);
  console.log('BaseForm - existingFiles:', existingFiles);
  console.log('BaseForm - removeEventImage:', removeEventImage);

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload Event Image"
        maxSize={5}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handleImageUpload}
        onRemove={handleFileRemove}
        existingFiles={existingFiles}
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
          options={
            eventCategories?.map((category) => ({
              value: String(category.id),
              label: category.name
            })) || []
          }
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
          name="is_free"
          label="Free or Paid Event"
          options={FreePaidOptions}
          value={watch('is_free')}
          onChange={(value) =>
            setValue('is_free', value, { shouldValidate: true })
          }
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
          required
        />
      </div>
    </div>
  );
};
