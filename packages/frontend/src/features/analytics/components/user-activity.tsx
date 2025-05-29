'use client';
import { AnalyticsSelect } from './common/analytics-select';
import { selectOptions } from './analytics';
import { UserActivityData } from '@/features/admin/types';

interface UserActivityProps {
  data: UserActivityData[];
  period: string;
  onPeriodChange: (period: string) => void;
}

export const UserActivity = ({
  data,
  period,
  onPeriodChange
}: UserActivityProps) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-4">
      <div className="flex w-full items-center justify-between gap-4">
        <h6 className="font-semibold">User Activity</h6>
        <AnalyticsSelect
          options={selectOptions}
          placeholder="Select a period"
          value={period}
          onValueChange={onPeriodChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        {data.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-white p-3"
          >
            <span className="font-medium">{activity.type}</span>
            <span className="text-lg font-semibold text-primary-600">
              {activity.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
