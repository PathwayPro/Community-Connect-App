import { FormSelect } from '@/shared/components/form';
import {
  goalsOptions,
  arrivalInCanadaOptions
} from '@/shared/lib/constants/profile';

export const GoalsForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <FormSelect
        name="arrivalInCanada"
        label="How many years have you been in Canada?"
        placeholder="Select option"
        customError="Years in Canada are required"
        options={arrivalInCanadaOptions}
      />
      <FormSelect
        name="goalId"
        label="What is your goal for joining Community Connect?"
        placeholder="Select option"
        customError="Goals are required"
        options={goalsOptions}
      />
    </div>
  );
};
