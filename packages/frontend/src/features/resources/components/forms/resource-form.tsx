import { FormSelect } from '@/shared/components/form/form-select';
import { FormInput } from '@/shared/components/form/form-input';
import { FormTextarea } from '@/shared/components/form/form-textarea';

export const resourceTypes = [
  { value: 'resume', label: 'Resume Template' },
  { value: 'cover_letter', label: 'Cover Letter Template' },
  { value: 'linkedin', label: 'LinkedIn Banner Template' },
  { value: 'business_card', label: 'Business Card Template' },
  { value: 'email_signature', label: 'Email Signature Template' },
  { value: 'portfolio', label: 'Portfolio Layout Template' },
  { value: 'personal_branding', label: 'Personal Branding Kit' },
  { value: 'job_application_tracker', label: 'Job Application Tracker' },
  { value: 'interview_prep', label: 'Interview Prep Kit' },
  { value: 'networking_tips', label: 'Networking Tips' },
  { value: 'career_planning', label: 'Career Planning Guide' },
  { value: 'salary_negotiation', label: 'Salary Negotiation Guide' },
  { value: 'other', label: 'Other' }
];

export const ResourceForm = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <FormSelect
        name="template_type"
        label="Template Type"
        placeholder="Select template type"
        options={resourceTypes}
        required
      />

      <div className="g ap-4 flex w-full">
        <FormInput
          name="title"
          label="Template Title"
          placeholder="Enter template title"
          customError="Title is required"
          required
        />
      </div>

      <FormTextarea
        name="details"
        label="Template Details"
        placeholder="Write template details..."
        customError="Details are required"
        maxLength={400}
        required
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="resource_link"
          label="Resource Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Enter resource link"
        />
      </div>
    </div>
  );
};
