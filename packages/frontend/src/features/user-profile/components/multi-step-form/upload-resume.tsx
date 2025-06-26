import { FileUpload } from '@/shared/components/upload/file-upload';
import { workStatusData } from '@/features/user-profile/lib/constants/profile';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { FormInput } from '@/shared/components/form/form-input';
import { FormSelect } from '@/shared/components/form/form-select';
import { Switch } from '@/shared/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { UserProfileFormData } from '../../lib/validations';
import { SkillsResponse } from '../../types';
import { toast } from 'sonner';
import { useState } from 'react';

interface UploadResumeProps {
  skills: SkillsResponse[];
  onResumeUpload: (files: File[]) => Promise<void>;
  existingResume?: string;
}

export const UploadResume = ({
  skills,
  onResumeUpload,
  existingResume
}: UploadResumeProps) => {
  const {
    setValue,
    formState: { errors },
    getValues,
    watch,
    register
  } = useFormContext<UserProfileFormData>();

  const [removeResume, setRemoveResume] = useState(false);

  // Register the field and watch its value for reactivity
  register('activelySearching');
  const activelySearching = watch('activelySearching');

  console.log('errors in upload resume :', errors);
  console.log('getValues in upload resume :', getValues());

  const handleFileUpload = async (files: File[]) => {
    try {
      if (files.length > 0) {
        setValue('resumeUploadLink', files[0], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        setRemoveResume(false); // Reset removal flag when new file is uploaded
        await onResumeUpload(files);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload resume');
    }
  };

  const handleFileRemove = (fileName: string) => {
    // Clear the form value when existing file is removed
    setValue('resumeUploadLink', undefined, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    // Set removal flag for backend
    setRemoveResume(true);

    // Store removal flag in form data
    setValue('removeResume', true, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });

    toast.success('Resume removed');
  };

  // Prepare existing file for display
  const existingFiles =
    existingResume && !removeResume
      ? [
          {
            name: existingResume.split('/').pop() || 'resume',
            url: `${process.env.NEXT_PUBLIC_API_URL}/files/${existingResume}`,
            type: 'application/pdf', // Default type, could be enhanced to detect actual type
            size: 0
          }
        ]
      : [];

  return (
    <div>
      <FileUpload
        title="Upload your Resume"
        maxSize={10} // 10MB
        acceptedFileTypes={['JPG', 'PNG', 'PDF']}
        multiple={false}
        uploadIcon="fileIcon"
        disablePreview={true}
        onUpload={handleFileUpload}
        onRemove={handleFileRemove}
        existingFiles={existingFiles}
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
          <Switch
            id="activelySearching"
            onCheckedChange={(checked) => {
              setValue('activelySearching', checked, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
            }}
            checked={activelySearching || false}
          />
        </div>
        <FormMultiSelect
          name="skills"
          label="Skills & Proficiencies"
          options={skills.map((skill) => ({
            label: skill.name,
            value: skill.id
          }))}
          placeholder="Select your skills"
          maxCount={5}
        />
      </div>
    </div>
  );
};
