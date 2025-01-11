import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { toast } from 'sonner';
import React from 'react';
import { MentorSchema } from '../../lib/validations';

export const BaseForm = () => {
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
        <FormInput
          name="availability"
          label="Availability"
          placeholder="Enter your availability"
          customError="Availability is required"
          required
        />
      </div>
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
