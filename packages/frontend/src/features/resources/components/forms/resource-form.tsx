'use client';

import { FormSelect } from '@/shared/components/form/form-select';
import { FormInput } from '@/shared/components/form/form-input';
import { FormTextarea } from '@/shared/components/form/form-textarea';
import { resourceTypes } from '../../lib/constants/enums';

export const ResourceForm = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <FormSelect
        name="type"
        label="Template Type"
        placeholder="Select template type"
        options={resourceTypes}
        required
      />

      <div className="flex w-full gap-4">
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
          name="link"
          label="Resource Link"
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Enter resource link"
        />
      </div>
    </div>
  );
};
