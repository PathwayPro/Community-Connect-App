'use client';

import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { NewsType } from '../../lib/constants/enums';
import { FormRadio } from '@/shared/components/form/form-radio';
import { useFormContext } from 'react-hook-form';

interface BaseFormProps {
  onFileUpload: (files: File[]) => Promise<void>;
  existingFiles?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

export const BaseForm = ({
  onFileUpload,
  existingFiles = []
}: BaseFormProps) => {
  const {
    setValue,
    formState: { errors }
  } = useFormContext();

  const [removeNewsImage, setRemoveNewsImage] = useState(false);

  const handlePosterUpload = async (files: File[]) => {
    try {
      await onFileUpload(files);
      setRemoveNewsImage(false); // Reset removal flag when new file is uploaded
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload news image');
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
    setRemoveNewsImage(true);

    // Store removal flag in form data
    setValue('removeImage', true, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });

    toast.success('News image removed');
  };

  // Prepare existing files for display
  const displayFiles = existingFiles && !removeNewsImage ? existingFiles : [];

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload News Poster"
        maxSize={5}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handlePosterUpload}
        onRemove={handleFileRemove}
        existingFiles={displayFiles}
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="title"
          label="News Title"
          placeholder="Enter news title"
          customError={errors.title?.message?.toString()}
          required
        />
      </div>

      <FormTextarea
        name="details"
        label="News Details"
        placeholder="Write your news details..."
        customError={errors.details?.message?.toString()}
        maxLength={400}
        required
      />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <FormRadio
          name="type"
          label="News Type"
          options={[
            {
              value: NewsType.FEATURED_POST,
              label: 'Featured Post',
              id: 'featured'
            },
            {
              value: NewsType.EDITORS_PICK,
              label: "Editor's Pick",
              id: 'editorial'
            }
          ]}
          customError={errors.type?.message?.toString()}
          required
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="link"
          label="Article Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Link text"
          customError={errors.link?.message?.toString()}
          required
        />
      </div>
    </div>
  );
};
