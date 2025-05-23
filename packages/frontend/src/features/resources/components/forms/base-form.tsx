'use client';

import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { NewsType } from '../../lib/constants/enums';
import { FormRadio } from '@/shared/components/form/form-radio';
import { useFormContext } from 'react-hook-form';

interface BaseFormProps {
  onFileUpload: (files: File[]) => Promise<void>;
}

export const BaseForm = ({ onFileUpload }: BaseFormProps) => {
  const {
    formState: { errors }
  } = useFormContext();

  const handlePosterUpload = async (files: File[]) => {
    try {
      await onFileUpload(files);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload news image');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload News Poster"
        maxSize={5}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handlePosterUpload}
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

      <div className="flex w-full gap-4">
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
