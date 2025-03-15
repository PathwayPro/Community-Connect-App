import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { MentorSchema } from '../../lib/validations';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { InterestsResponse } from '../../types';

interface BaseFormProps {
  isMentor: boolean;
  interests: InterestsResponse[];
  experienceDetails: string;
}

export const BaseForm = ({
  isMentor,
  interests,
  experienceDetails
}: BaseFormProps) => {
  const { setValue, watch } = useFormContext<MentorSchema>();

  console.log('exp', experienceDetails);

  // Watch interests value
  const selectedInterests = watch('interests');

  const interestsOptions = React.useMemo(
    () =>
      interests?.map((interest) => ({
        value: interest.id.toString(),
        label: interest.name
      })) || [],
    [interests]
  );

  const handleFileUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      console.log('formData', formData);

      toast.success('Resume uploaded successfully');

      //   const response = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: formData
      //   });

      //   if (!response.ok) throw new Error('Upload failed');

      //   const { urls } = await response.json();
      //   setValue('resume_upload_link', urls[0], { shouldValidate: true });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload your Resume/CV"
        maxSize={10} // 10MB
        acceptedFileTypes={['PDF', 'DOC', 'DOCX']}
        multiple={false}
        uploadIcon="fileIcon"
        disablePreview={true}
        onUpload={handleFileUpload}
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          customError="First name is required"
          disabled
          required
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          customError="Last name is required"
          disabled
          required
        />
      </div>
      {isMentor && (
        <>
          <div className="flex w-full gap-4">
            <FormInput
              name="profession"
              label="Profession"
              placeholder="Enter your profession"
              customError="Profession is required"
              required
              disabled
            />
            <FormInput
              name="experience"
              label="Years of Experience"
              type="number"
              min={0}
              placeholder="Enter your years of experience"
              customError="Years of experience is required"
              required
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setValue('experience', value, { shouldValidate: true });
              }}
            />
          </div>
          <div className="flex w-full gap-4">
            <FormInput
              name="max_mentees"
              label="No. of mentees you can accomodate"
              type="number"
              min={1}
              placeholder="Enter your max mentees"
              customError="Max mentees is required"
              required
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setValue('max_mentees', value, { shouldValidate: true });
              }}
            />
            <FormInput
              name="availability"
              label="Availability"
              placeholder="Enter your availability"
            />
          </div>
        </>
      )}
      <FormMultiSelect
        name="interests"
        label="Interests"
        options={interestsOptions}
        placeholder="Select your areas of interest"
        maxCount={5}
        value={selectedInterests}
      />
      <FormTextarea
        name="experience_details"
        label={experienceDetails}
        placeholder="Write something about your experience/goals..."
        customError="Experience details is required"
        required
      />
    </div>
  );
};
