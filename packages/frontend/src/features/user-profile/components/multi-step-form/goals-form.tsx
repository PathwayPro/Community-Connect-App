import { FormSelect } from '@/shared/components/form';
import { yearsInCanadaOptions, goalsOptions } from '@/shared/lib/constants/profile';

export const GoalsForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <FormSelect
        name="yearsInCanada"
        label="How many years have you been in Canada?"
        placeholder="Select option"
        customError="Years in Canada are required"
        options={yearsInCanadaOptions}
      />
      <FormSelect
        name="goals"
        label="What is your goal for joining Community Connect?"
        placeholder="Select option"
        customError="Goals are required"
        options={goalsOptions}
      />
    </div>
  );
};
