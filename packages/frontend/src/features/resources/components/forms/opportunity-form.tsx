import { useFormContext } from 'react-hook-form';
import { FormInput, FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import {
  OpportunityFormValues,
  workModeTypes
} from '@/features/resources/lib/validation';
import { FormSelect } from '@/shared/components/form/form-select';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { Label } from '@/shared/components/ui/label';

export const OpportunityForm = () => {
  const { setValue, watch } = useFormContext<OpportunityFormValues>();

  const handleCompanyLogoUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      toast.success('Company logo uploaded successfully');
      // ... existing upload logic ...
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload company logo');
    }
  };

  const salaryRanges = [
    { value: '0-50000', label: '$0 - $50,000' },
    { value: '50000-75000', label: '$50,000 - $75,000' },
    { value: '75000-100000', label: '$75,000 - $100,000' },
    { value: '100000-125000', label: '$100,000 - $125,000' },
    { value: '125000-150000', label: '$125,000 - $150,000' },
    { value: '150000-175000', label: '$150,000 - $175,000' },
    { value: '175000-200000', label: '$175,000 - $200,000' },
    { value: '200000', label: '$200,000+' }
  ];

  const workModeOptions = [
    { value: workModeTypes.REMOTE, label: 'Remote' },
    { value: workModeTypes.HYBRID, label: 'Hybrid' },
    { value: workModeTypes.ON_SITE, label: 'On-site' }
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <FormInput
        name="jobTitle"
        label="Job Title"
        placeholder="Enter job title"
        customError="Job title is required"
        required
      />
      <FormInput
        name="companyName"
        label="Company Name"
        placeholder="Enter company name"
        customError="Company name is required"
        required
      />
      <FileUpload
        title="Upload Company Logo"
        maxSize={2}
        acceptedFileTypes={['JPG', 'JPEG', 'PNG']}
        multiple={false}
        uploadIcon="image"
        onUpload={handleCompanyLogoUpload}
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
        name="salaryRange"
        label="Annual Salary Range"
        placeholder="Select salary range"
        options={salaryRanges}
      />
      <div className="flex w-full gap-4">
        <CustomSwitch
          name="work_mode"
          label="Work Mode"
          options={workModeOptions}
          value={watch('work_mode')}
          onChange={(value) => setValue('work_mode', value)}
          required
        />
      </div>
      nb
      <FormInput
        name="applyLink"
        label="Link to Apply"
        placeholder="Enter application URL"
        hasLabelInput={true}
        leftLabel="https://"
      />
      <FormInput
        name="jobPostingLink"
        label="Job Posting Link"
        placeholder="Enter job posting URL"
        hasLabelInput={true}
        leftLabel="https://"
      />
      <FormTextarea
        name="description"
        label="Job Description"
        placeholder="Write the job description..."
        customError="Job description is required"
        required
      />
    </div>
  );
};
