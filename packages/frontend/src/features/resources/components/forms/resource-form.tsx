'use client';

import { FormSelect } from '@/shared/components/form/form-select';
import { FormInput } from '@/shared/components/form/form-input';
import { FormTextarea } from '@/shared/components/form/form-textarea';
import { resourceTypes } from '../../lib/constants/enums';
import { useFormContext } from 'react-hook-form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResourceFormProps {
  onFileUpload: (files: File[]) => Promise<void>;
  existingFiles?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

export const ResourceForm = ({
  onFileUpload,
  existingFiles = []
}: ResourceFormProps) => {
  const {
    formState: { errors },
    setValue
  } = useFormContext();

  const [removeResourceFile, setRemoveResourceFile] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      setValue('file', files[0], { shouldValidate: true });
      await onFileUpload(files);
      setRemoveResourceFile(false); // Reset removal flag when new file is uploaded
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
    setRemoveResourceFile(true);

    // Store removal flag in form data
    setValue('removeFile', true, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });

    toast.success('Resource file removed');
  };

  // Prepare existing files for display
  const displayFiles =
    existingFiles && !removeResourceFile ? existingFiles : [];

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload Resource File (Optional)"
        maxSize={10}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG', 'PDF', 'DOC', 'DOCX']}
        multiple={false}
        uploadIcon="fileIcon"
        onUpload={handleFileUpload}
        onRemove={handleFileRemove}
        existingFiles={displayFiles}
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
          label="Resource Link (Optional)"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Enter resource link"
          customError={errors.link?.message as string}
        />
      </div>
    </div>
  );
};
