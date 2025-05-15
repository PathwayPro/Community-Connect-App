'use client';

import { FormSelect } from '@/shared/components/form/form-select';
import { FormInput } from '@/shared/components/form/form-input';
import { FormTextarea } from '@/shared/components/form/form-textarea';
import { resourceTypes } from '../../lib/constants/enums';
import { useFormContext } from 'react-hook-form';

export const ResourceForm = () => {
  const {
    formState: { errors }
  } = useFormContext();

  return (
    <div className="flex w-full flex-col gap-4">
      <FormSelect
        name="type"
        label="Resource Type"
        placeholder="Select resource type"
        options={resourceTypes}
        required
      />

      <div className="flex w-full gap-4">
        <FormInput
          name="title"
          label="Resource Title"
          placeholder="Enter resource title"
          customError="Title is required"
          required
        />
      </div>

      <FormTextarea
        name="details"
        label="Resource Details"
        placeholder="Write resource details..."
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
          customError={errors.link?.message as string}
        />
      </div>
    </div>
  );
};
