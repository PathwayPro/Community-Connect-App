import { FormInput } from '@/shared/components/form';
import React from 'react';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { useFormContext } from 'react-hook-form';

const eventTimeOptions = [
  {
    value: 'single',
    label: 'Single Event'
  },
  {
    value: 'recurring',
    label: 'Recurring Event'
  }
];
export const TimeLocationForm = () => {
  const { setValue, watch } = useFormContext();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full justify-center gap-4">
        <CustomSwitch
          name="event_time"
          options={eventTimeOptions}
          value={watch('type')}
          onChange={(value) => setValue('type', value)}
        />
      </div>
      <div className="flex w-full gap-4">
        <FormInput
          name="date"
          label="Event Date"
          placeholder="mm/dd/yyyy"
          required
        />
      </div>
      <div className="flex w-full gap-4">
        <FormInput
          hasInputIcon
          rightIcon="clock"
          name="start_time"
          label="Event Start Time"
          placeholder="00:00 AM"
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          hasInputIcon
          rightIcon="clock"
          name="end_time"
          label="Event End Time"
          placeholder="00:00 AM"
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="location"
          label="Event Location"
          hasInputIcon
          leftIcon="search"
          rightIcon="map"
          placeholder="Search Location"
        />
      </div>
    </div>
  );
};
