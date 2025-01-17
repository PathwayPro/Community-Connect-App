import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FormDatePicker } from '@/shared/components/form/form-date-picker';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { provinceData } from '@/shared/lib/constants/profile';
import { toast } from 'sonner';
import React from 'react';
import { UserProfileFormData } from '../../lib/validations';

export const PersonalInfoForm = () => {
  const { setValue, watch } = useFormContext<UserProfileFormData>();

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
      setValue('pictureUploadLink', urls[0], { shouldValidate: true });
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        title="Add Profile Picture"
        maxSize={10}
        acceptedFileTypes={['SVG', 'JPG', 'PNG']}
        multiple={false}
        uploadIcon="userRoundPlus"
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
        <div className="flex-1">
          <FormSelect
            name="province"
            label="Province"
            placeholder="Enter your province"
            customError="Province is required"
            options={provinceData}
            required
          />
        </div>
        <div className="flex-1">
          <FormInput
            name="city"
            label="City"
            placeholder="Enter your city"
            customError="City is required"
          />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <FormDatePicker
          name="dob"
          label="Date of Birth"
          customError="Date of birth is required"
          required
        />
        <FormInput
          name="languages"
          label="Languages Spoken (comma separated)"
          placeholder="Enter your languages spoken"
          customError="Languages spoken is required"
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
          placeholder="Enter your years of experience"
          customError="Years of experience is required"
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
