import { FormInput, FormSelect } from '@/shared/components/form';
import React, { useEffect } from 'react';
import { CustomSwitch } from '@/shared/components/custom-switch/custom-switch';
import { useFormContext } from 'react-hook-form';
import { EventFormValues, EventsTypes } from '../../lib/validation';
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
    formState: { errors },
    trigger
  } = useFormContext<EventFormValues>();

  const startTime = watch('start_time');
  const endTime = watch('end_time');

  // Validate end time whenever start time or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      trigger('end_time');
    }
  }, [startTime, endTime, trigger]);

  const validateEndTime = (endTimeValue: string) => {
    if (!startTime || !endTimeValue) return true;

    const [startHour, startMinute, startPeriod] = startTime.split(/[:\s]/);
    const [endHour, endMinute, endPeriod] = endTimeValue.split(/[:\s]/);

    // Validate time format
    if (
      !startHour ||
      !startMinute ||
      !startPeriod ||
      !endHour ||
      !endMinute ||
      !endPeriod
    ) {
      return false;
    }

    let startHourNum = parseInt(startHour);
    let endHourNum = parseInt(endHour);
    const startMinuteNum = parseInt(startMinute);
    const endMinuteNum = parseInt(endMinute);

    // Validate numeric values
    if (
      isNaN(startHourNum) ||
      isNaN(endHourNum) ||
      isNaN(startMinuteNum) ||
      isNaN(endMinuteNum) ||
      startHourNum < 1 ||
      startHourNum > 12 ||
      endHourNum < 1 ||
      endHourNum > 12 ||
      startMinuteNum < 0 ||
      startMinuteNum > 59 ||
      endMinuteNum < 0 ||
      endMinuteNum > 59
    ) {
      return false;
    }

    // Convert to 24-hour format for comparison
    if (startPeriod === 'PM' && startHourNum < 12) startHourNum += 12;
    if (startPeriod === 'AM' && startHourNum === 12) startHourNum = 0;
    if (endPeriod === 'PM' && endHourNum < 12) endHourNum += 12;
    if (endPeriod === 'AM' && endHourNum === 12) endHourNum = 0;

    const start = new Date(2000, 0, 1, startHourNum, startMinuteNum);
    const end = new Date(2000, 0, 1, endHourNum, endMinuteNum);

    // Ensure end time is at least 15 minutes after start time
    const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    return end.getTime() - start.getTime() >= minDuration;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-4">
        <FormDatePicker
          name="start_date"
          label="Event Date"
          customError={errors.start_date?.message as string}
          useDateTimePicker
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
          onChange={(e) => {
            setValue('start_time', e, { shouldValidate: true });
            if (watch('end_time')) {
              trigger('end_time');
            }
          }}
          required
        />
        <FormSelect
          name="end_time"
          label="Event End Time"
          placeholder="00:00 AM"
          customError={
            (errors.end_time?.message as string) ||
            (validateEndTime(watch('end_time'))
              ? undefined
              : 'End time must be later than start time')
          }
          options={timeOptions}
          onChange={(e) => {
            setValue('end_time', e, { shouldValidate: true });
            if (watch('start_time')) {
              trigger('start_time');
            }
          }}
          required
          rules={{
            validate: {
              isAfterStart: validateEndTime
            }
          }}
        />
      </div>

      <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="type"
          label="Event Type"
          options={eventTypeOptions}
          value={watch('type')}
          onChange={(value) =>
            setValue('type', value, { shouldValidate: true })
          }
          required
        />
      </div>

      {/* <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="requires_confirmation"
          label="Requires Confirmation"
          options={trueFalseOptions}
          value={watch('requires_confirmation')}
          onChange={(value) =>
            setValue('requires_confirmation', value, { shouldValidate: true })
          }
          required
        />
      </div> */}

      {/* <div className="flex w-full justify-start gap-4 pt-4">
        <CustomSwitch
          name="accept_subscriptions"
          label="Accept Subscriptions"
          options={trueFalseOptions}
          value={watch('accept_subscriptions')}
          onChange={(value) =>
            setValue('accept_subscriptions', value, { shouldValidate: true })
          }
          required
        />
      </div> */}

      <div className="flex w-full gap-4">
        <FormInput
          name="location"
          label="Event Location"
          hasInputIcon
          leftIcon="map"
          placeholder="Enter event location"
          onChange={(e) =>
            setValue('location', e.target.value, { shouldValidate: true })
          }
          required
        />
      </div>
    </div>
  );
};
