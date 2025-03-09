import React, { useState } from 'react';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateSelection {
  day: number;
  month: string;
}

interface DayMonthPickerProps {
  onSelect?: (date: DateSelection) => void;
  className?: string;
}

const months: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const;

const DayMonthPicker: React.FC<DayMonthPickerProps> = ({
  onSelect,
  className
}) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const handleSelect = (selectedDate: Date | undefined): void => {
    if (!selectedDate) return;
    setDate(selectedDate);
    setIsOpen(false);
    onSelect?.({
      day: selectedDate.getDate(),
      month: months[selectedDate.getMonth()]
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-60 justify-between border-neutral-light-400 text-left text-sm font-normal ${!date && 'text-gray-500'} ${className}`}
        >
          {date ? formatDate(date) : 'Pick a date'}
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          ISOWeek
          showOutsideDays={false}
          formatters={{
            formatCaption: (date) => {
              return months[date.getMonth()];
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DayMonthPicker;
