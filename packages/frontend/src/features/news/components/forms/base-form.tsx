import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { FormCheckbox } from '@/shared/components/form/form-checkbox';
import { NewsFormValues } from '@/features/news/lib/validation';

interface BaseFormProps {
  mode: 'create' | 'edit';
  newsId?: string;
}

export const BaseForm = ({ mode, newsId }: BaseFormProps) => {
  const { setValue, watch } = useFormContext<NewsFormValues>();

  console.log(mode, newsId);

  const handlePosterUpload = async (files: File[]) => {
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

      <FormTextarea
        name="content"
        label="News Details"
        placeholder="Write your news details..."
        customError="Content is required"
        maxLength={400}
        required
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="keywords"
          label="Keywords"
          placeholder="Enter keywords (comma separated)"
        />
      </div>

      <div className="flex w-full gap-4">
        <FormCheckbox
          name="news_type"
          label="News Type"
          options={[
            { value: 'featured', label: 'Featured Post', id: 'featured' },
            { value: 'editorial', label: "Editor's Pick", id: 'editorial' }
          ]}
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="link"
          label="Article Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Link text"
        />
      </div>
    </div>
  );
};
