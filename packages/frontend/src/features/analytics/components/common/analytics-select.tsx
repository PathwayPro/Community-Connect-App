'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';

interface AnalyticsSelectProps {
  options: { label: string; value: string }[];
  placeholder: string;
}

export const AnalyticsSelect = ({
  options,
  placeholder
}: AnalyticsSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );

  return (
    <Select
      value={selectedOption}
      onValueChange={setSelectedOption}
      defaultValue={options[0].value}
    >
      <SelectTrigger className="w-[140px] bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
