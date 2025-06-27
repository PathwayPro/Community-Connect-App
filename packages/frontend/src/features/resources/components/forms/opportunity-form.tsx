'use client';

import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect, FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { OpportunityFormValues } from '@/features/resources/lib/validation';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { Label } from '@/shared/components/ui/label';
import { WorkSettings } from '@/features/resources/lib/constants/enums';
import { SalaryRangeResponseDto } from '../../dto/opportunity-dto';

// TODO: Get work mode options from the backend
const workModeOptions = [
  { value: WorkSettings.REMOTE, label: 'Remote' },
  { value: WorkSettings.HYBRID, label: 'Hybrid' },
  { value: WorkSettings.ON_SITE, label: 'On-site' }
];

const experienceOptions = [
  { value: '1 - 3 years', label: '1 - 3 years' },
  { value: '3 - 5 years', label: '3 - 5 years' },
  { value: '5 - 10 years', label: '5 - 10 years' },
  { value: '10+ years', label: '10+ years' }
];

export const OpportunityForm = ({
  salaryRanges,
  onFileUpload,
  existingFiles = []
}: {
  salaryRanges: SalaryRangeResponseDto[];
  onFileUpload: (files: File[]) => Promise<void>;
  existingFiles?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}) => {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<OpportunityFormValues>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Ensure salary range options are properly formatted
  const formattedSalaryRanges =
    salaryRanges?.map((range) => ({
      label: `$${range.from} - $${range.to}`,
      value: range.id.toString() // Ensure value is string
    })) || [];

  const handleCompanyLogoUpload = async (files: File[]) => {
    try {
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        await onFileUpload(files);
        toast.success('Company logo uploaded successfully');
      } else {
        setSelectedFile(null);
        toast.error('No file selected');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload company logo');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FormInput
        name="job"
        label="Job Title"
        placeholder="Enter job title"
        customError={errors.job?.message as string}
        required
      />
      <FormInput
        name="company"
        label="Company Name"
        placeholder="Enter company name"
        customError={errors.company?.message as string}
        required
      />
      <FileUpload
        title="Upload Company Logo"
        maxSize={2}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handleCompanyLogoUpload}
        existingFiles={existingFiles}
      />
      <Label className="mt-2">Location</Label>
      <div className="flex w-full gap-4">
        <FormInput
          name="province"
          label="Province"
          placeholder="Enter province"
        />
        <FormInput name="city" label="City" placeholder="Enter city" />
      </div>

      <FormSelect
        name="experience"
        label="Experience"
        placeholder="Select experience"
        options={experienceOptions}
        required
      />

      <FormSelect
        name="salary_range_id"
        label="Annual Salary Range"
        placeholder="Select salary range"
        options={formattedSalaryRanges}
      />
      <div className="flex w-full gap-4">
        <CustomSwitch
          name="settings"
          label="Work Mode"
          options={workModeOptions}
          value={watch('settings') || WorkSettings.REMOTE}
          onChange={(value) => setValue('settings', value)}
          required
        />
      </div>

      <FormInput
        name="link_apply"
        label="Link to Apply"
        placeholder="Enter application URL"
        hasLabelInput={true}
        leftLabel="https://"
        customError={errors.link_apply?.message as string}
        required
      />

      <FormInput
        name="link_post"
        label="Link to Job Post"
        placeholder="Enter job post URL"
        hasLabelInput={true}
        leftLabel="https://"
        customError={errors.link_post?.message as string}
        required
      />

      <FormTextarea
        name="description"
        label="Job Description"
        placeholder="Write job description..."
        customError={errors.description?.message as string}
        maxLength={1000}
        required
      />
    </div>
  );
};
