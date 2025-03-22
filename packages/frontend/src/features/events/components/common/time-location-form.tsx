import { FormInput, FormSelect } from '@/shared/components/form';
import React from 'react';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { useFormContext } from 'react-hook-form';
import { EventsTypes, trueFalseOptions } from '../../lib/validation';
import { FormDatePicker } from '@/shared/components/form/form-date-picker';
import { timeOptions } from '../../lib/constants';

const eventTypeOptions = [
  {
    value: EventsTypes.PUBLIC,
    label: 'Public Event'
  },
  {
    value: EventsTypes.PRIVATE,
    label: 'Private Event'
  }
];

export const TimeLocationForm = () => {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  const startTime = watch('start_time');
  const endTime = watch('end_time');

  const validateEndTime = (endTimeValue: string) => {
    if (!startTime || !endTimeValue) return true;

    const [startHour, startMinute, startPeriod] = startTime.split(/[:\s]/);
    const [endHour, endMinute, endPeriod] = endTimeValue.split(/[:\s]/);

    const start = new Date(
      2000,
      0,
      1,
      startPeriod === 'PM' ? parseInt(startHour) + 12 : parseInt(startHour),
      parseInt(startMinute)
    );

    const end = new Date(
      2000,
      0,
      1,
      endPeriod === 'PM' ? parseInt(endHour) + 12 : parseInt(endHour),
      parseInt(endMinute)
    );

    return end > start;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-4">
        <FormDatePicker
          name="date"
          label="Event Date"
          customError={errors.date?.message as string}
          required
        />
      </div>
      <div className="flex w-full gap-4">
        <FormSelect
          name="start_time"
          label="Event Start Time"
          placeholder="00:00 AM"
          customError={errors.start_time?.message as string}
          options={timeOptions}
          required
        />
        <FormSelect
          name="end_time"
          label="Event End Time"
          placeholder="00:00 AM"
          customError={errors.end_time?.message as string}
          options={timeOptions}
          required
          rules={{
            validate: validateEndTime
          }}
        />
      </div>

      <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="type"
          label="Event Type"
          options={eventTypeOptions}
          value={watch('type')}
          onChange={(value) => setValue('type', value)}
          required
        />
      </div>

      <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="requires_confirmation"
          label="Requires Confirmation"
          options={trueFalseOptions}
          value={watch('requires_confirmation')}
          onChange={(value) => setValue('requires_confirmation', value)}
          required
        />
      </div>

      <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="accept_subscriptions"
          label="Accept Subscriptions"
          options={trueFalseOptions}
          value={watch('accept_subscriptions')}
          onChange={(value) => setValue('accept_subscriptions', value)}
          required
        />
      </div>

      <div className="flex w-full gap-4">
        <FormInput
          name="location"
          label="Event Location"
          hasInputIcon
          leftIcon="map"
          placeholder="Enter event location"
        />
      </div>
    </div>
  );
};
