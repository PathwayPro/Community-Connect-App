import { FormInput, FormSelect } from '@/shared/components/form';
import { FormTextarea } from '@/shared/components/form';
import { FormDatePicker } from '@/shared/components/form/form-date-picker';
import { FileUpload } from '@/shared/components/upload/file-upload';
import { provinceData } from '@/shared/lib/constants/profile';

export const PersonalInfoForm = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <FileUpload
        maxSize={10} // 10MB
        acceptedFileTypes={['SVG', 'JPG', 'PNG']}
        multiple={false}
        uploadIcon="userRoundPlus"
        onUpload={async (files) => {
          // Implement your upload logic here
          // e.g., using FormData and fetch
          const formData = new FormData();
          files.forEach((file) => formData.append('files', file));

          await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
        }}
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
            required
            options={provinceData}
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
          label="Languages Spoken"
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
