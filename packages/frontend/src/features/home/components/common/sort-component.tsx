'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';

interface SortComponentProps {
  sort: string;
  setSort: (sort: string) => void;
  options: { value: string; label: string }[];
}

export const SortComponent = ({
  sort,
  setSort,
  options
}: SortComponentProps) => {
  return (
    <Select onValueChange={setSort}>
      <SelectTrigger className="h-12 w-[140px] rounded-xl border border-primary-100">
        <SelectValue placeholder="Sort by" defaultValue={sort} />
      </SelectTrigger>
      <SelectContent className="w-fit">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
