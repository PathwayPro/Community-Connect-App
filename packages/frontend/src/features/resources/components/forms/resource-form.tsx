'use client';

import { FormSelect } from '@/shared/components/form/form-select';
import { FormInput } from '@/shared/components/form/form-input';
import { FormTextarea } from '@/shared/components/form/form-textarea';
import { resourceTypes } from '../../lib/constants/enums';
import { useFormContext } from 'react-hook-form';
import { FileUpload } from '@/shared/components/upload/file-upload';

interface ResourceFormProps {
  onFileUpload: (files: File[]) => Promise<void>;
}

export const ResourceForm = ({ onFileUpload }: ResourceFormProps) => {
  const {
    formState: { errors },
    setValue
  } = useFormContext();

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      setValue('file', files[0], { shouldValidate: true });
      await onFileUpload(files);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload Resource File"
        maxSize={10}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG', 'PDF', 'DOC', 'DOCX']}
        multiple={false}
        uploadIcon="fileIcon"
        onUpload={handleFileUpload}
      />

      <FormSelect
        name="type"
        label="Resource Type"
        placeholder="Select resource type"
        options={resourceTypes}
        required
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="title"
          label="Resource Title"
          placeholder="Enter resource title"
          customError={errors.title?.message as string}
          required
        />
      </div>

      <FormTextarea
        name="details"
        label="Resource Details"
        placeholder="Write resource details..."
        customError={errors.details?.message as string}
        maxLength={400}
        required
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="link"
          label="Resource Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Enter resource link"
          customError={errors.link?.message as string}
          required
        />
      </div>
    </div>
  );
};
