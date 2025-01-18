import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { MentorSchema } from '../../lib/validations';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';

const interestsOptions = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'fullstack', label: 'Full-Stack Development' },
  { value: 'mobile', label: 'Mobile App Development (iOS/Android)' },
  { value: 'game', label: 'Game Development' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'data_analytics', label: 'Data and Analytics' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'project_management', label: 'Program/Project Management' },
  { value: 'agile_coaching', label: 'Agile Coaching' },
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'qa_testing', label: 'Quality Assurance and Testing' },
  { value: 'vc_investments', label: 'Venture Capital/Investments' },
  { value: 'startup_advisory', label: 'Startup Advisory' },
  { value: 'networking_it', label: 'Networking and IT' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'career_transition', label: 'Career Transition' },
  { value: 'career_coaching', label: 'Career Coaching' },
  { value: 'other', label: 'Others' }
];

const daysOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

interface BaseFormProps {
  isMentor: boolean;
}

export const BaseForm = ({ isMentor }: BaseFormProps) => {
  const { setValue, watch } = useFormContext<MentorSchema>();

  // Watch values for debugging
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  React.useEffect(() => {
    console.log('Current form values:', {
      firstName,
      lastName
    });
  }, [firstName, lastName]);

  const handleFileUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const { urls } = await response.json();
      setValue('resume_upload_link', urls[0], { shouldValidate: true });
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Upload your Resume/CV"
        maxSize={10}
        acceptedFileTypes={['.pdf', '.txt', '.doc', '.docx']}
        multiple={false}
        uploadIcon="fileIcon"
        onUpload={handleFileUpload}
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          customError="First name is required"
          required
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          customError="Last name is required"
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
            />
            <FormInput
              name="experience"
              label="Years of Experience"
              type="number"
              placeholder="Enter your years of experience"
              customError="Years of experience is required"
              required
            />
          </div>
          <div className="flex w-full gap-4">
            <FormInput
              name="max_mentees"
              label="Max Mentees"
              type="number"
              placeholder="Enter your max mentees"
              customError="Max mentees is required"
              required
            />
            <FormMultiSelect
              name="availability"
              label="Availability"
              options={daysOptions}
              placeholder="Select your availability"
              maxCount={2}
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
      />
      <FormTextarea
        name="bio"
        label="Bio"
        placeholder="Write something about yourself..."
        customError="Bio is required"
        required
      />
    </div>
  );
};
