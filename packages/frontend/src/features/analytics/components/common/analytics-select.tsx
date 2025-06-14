'use client';

import { useEffect, useState } from 'react';

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
  const [selectedOption, setSelectedOption] = useState<string>(
    value || options[0]?.value || ''
  );

  // Update local state when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedOption(newValue);
    onValueChange?.(newValue);
  };

  // Find the selected option label for display
  const selectedLabel =
    options.find((option) => option.value === selectedOption)?.label ||
    placeholder;

  return (
    <Select value={selectedOption} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px] bg-white">
        <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
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
