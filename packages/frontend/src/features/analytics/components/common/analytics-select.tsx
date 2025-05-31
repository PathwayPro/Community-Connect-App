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
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const AnalyticsSelect = ({
  options,
  placeholder,
  value,
  onValueChange
}: AnalyticsSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    value
  );

  return (
    <Select
      value={selectedOption}
      onValueChange={onValueChange || setSelectedOption}
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
