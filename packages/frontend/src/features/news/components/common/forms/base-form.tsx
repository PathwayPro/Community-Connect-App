import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { NewsFormValues } from '../../../lib/validation';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';

interface BaseFormProps {
  mode: 'create' | 'edit';
  newsId?: string;
}

export const BaseForm = ({ mode, newsId }: BaseFormProps) => {
  const { setValue, watch } = useFormContext<NewsFormValues>();

  console.log(mode, newsId);

  const handleImageUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      toast.success('News image uploaded successfully');

      //   const response = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: formData
      //   });

      //   if (!response.ok) throw new Error('Upload failed');

      //   const { urls } = await response.json();
      //   setValue('image', urls[0], { shouldValidate: true });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload news image');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload News Image"
        maxSize={5}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handleImageUpload}
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="title"
          label="News Title"
          placeholder="Enter news title"
          customError="Title is required"
          required
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="subtitle"
          label="Subtitle"
          placeholder="Enter news subtitle"
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="keywords"
          label="Keywords"
          placeholder="Enter keywords (comma separated)"
        />
      </div>

      <FormTextarea
        name="content"
        label="News Content"
        placeholder="Write your news content..."
        customError="Content is required"
        required
      />

      <div className="flex w-full gap-4">
        <CustomSwitch
          name="published"
          label="Publication Status"
          options={[
            { value: false, label: 'Draft' },
            { value: true, label: 'Published' }
          ]}
          value={watch('published')}
          onChange={(value) => setValue('published', value)}
        />
      </div>
    </div>
  );
};
