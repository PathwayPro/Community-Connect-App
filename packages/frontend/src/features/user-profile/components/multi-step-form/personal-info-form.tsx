import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FormDatePicker } from '@/shared/components/form/form-date-picker';
import { FileUpload } from '@/shared/components/upload/file-upload';
import {
  ageRangeData,
  provinceData
} from '@/features/user-profile/lib/constants/profile';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { UserProfileFormData } from '../../lib/validations';
import { getImageUrl } from '@/shared/components/navigation/main-nav/main-nav';

interface PersonalInfoFormProps {
  onProfilePictureUpload: (files: File[]) => Promise<void>;
  existingProfilePicture?: string;
}

export const PersonalInfoForm = ({
  onProfilePictureUpload,
  existingProfilePicture
}: PersonalInfoFormProps) => {
  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<UserProfileFormData>();

  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);

  // Watch values for debugging
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  console.log('errors', errors);

  React.useEffect(() => {
    console.log('Current form values:', {
      firstName,
      lastName
    });
  }, [firstName, lastName]);

  const handleFileUpload = async (files: File[]) => {
    try {
      if (files.length > 0) {
        setValue('pictureUploadLink', files[0], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        setRemoveProfilePicture(false); // Reset removal flag when new file is uploaded
        await onProfilePictureUpload(files);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const handleFileRemove = (fileName: string) => {
    // Clear the form value when existing file is removed
    setValue('pictureUploadLink', undefined, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    // Set removal flag for backend
    setRemoveProfilePicture(true);

    // Store removal flag in form data
    setValue('removeProfilePicture', true, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });

    toast.success('Profile picture removed');
  };

  // Prepare existing file for display
  const existingFiles =
    existingProfilePicture && !removeProfilePicture
      ? [
          {
            name: existingProfilePicture.split('/').pop() || 'profile-picture',
            url: getImageUrl(existingProfilePicture),
            type: 'image/jpeg', // Default type, could be enhanced to detect actual type
            size: 0
          }
        ]
      : [];

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <FileUpload
          title="Add Profile Picture"
          maxSize={10}
          acceptedFileTypes={['SVG', 'JPG', 'PNG']}
          multiple={false}
          uploadIcon="userRoundPlus"
          onUpload={handleFileUpload}
          onRemove={handleFileRemove}
          existingFiles={existingFiles}
        />
      </div>

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
        <div className="flex-1">
          <FormDatePicker
            name="dob"
            label="Date of Birth (Select birth month and day)"
            customError="Date of birth is required"
            required
          />
        </div>
        <div className="flex-1">
          <FormSelect
            name="ageRange"
            label="Age Range (This will not be visible to the public)"
            placeholder="Enter your age range"
            customError="Age range is required"
            options={ageRangeData}
            required
          />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <FormInput
          name="countryOfOrigin"
          label="Country of Origin"
          placeholder="Enter your country of origin"
          customError="Country of origin is required"
        />
        <FormInput
          name="languages"
          label="Languages Spoken (comma separated)"
          placeholder="Enter your languages spoken"
          customError="Languages spoken is required"
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
