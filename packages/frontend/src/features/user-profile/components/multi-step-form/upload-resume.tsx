import { FileUpload } from '@/shared/components/upload/file-upload';
import { skillsOptions, workStatusData } from '@/shared/lib/constants/profile';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { FormInput } from '@/shared/components/form/form-input';
import { FormSelect } from '@/shared/components/form/form-select';
import { Switch } from '@/shared/components/ui/switch';

export const UploadResume = () => {
  return (
    <div>
      <FileUpload
        title="Upload your Resume"
        maxSize={10} // 10MB
        acceptedFileTypes={['JPG', 'PNG', 'PDF']}
        multiple={false}
        uploadIcon="fileIcon"
        disablePreview={true}
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

      <div className="mt-6 flex w-full flex-col gap-4">
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
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <FormSelect
              name="workStatus"
              label="Work Status (This will not be visible to the public)"
              placeholder="Enter your work status"
              customError="Work status is required"
              options={workStatusData}
              required
            />
          </div>
          <div className="flex-1">
            <FormInput
              name="companyName"
              label="Company Name"
              placeholder="Enter your company name"
              customError="Company name is required"
            />
          </div>
        </div>
        <div className="my-2 flex w-full items-center justify-end gap-4">
          <p>Actively Searching</p>
          <Switch name="activelySearching" />
        </div>
        <FormMultiSelect
          name="skills"
          label="Skills & Proficiencies"
          options={skillsOptions}
          placeholder="Select your skills"
          maxCount={5}
        />
      </div>
    </div>
  );
};
