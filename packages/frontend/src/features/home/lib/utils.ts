// create a function to transform datetime to time ago
// let days less than a week be in days
// let days more than 6 days display the date in format MM/DD/YYYY

import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns';

export const transformDateTimeToTimeAgo = (date: string) => {
  try {
    const now = new Date();
    let then: Date;

    if (date && typeof date === 'string') {
      try {
        then = parseISO(date);
      } catch (parseError) {
        then = new Date(date);
      }
    } else {
      return 'Invalid date';
    }

    if (!isValid(then)) {
      return 'Invalid date';
    }

    const diffDays = differenceInCalendarDays(now, then);

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return format(then, 'MMM d, yyyy');
    }
  } catch (error) {
    console.error('Error parsing date:', date, error);
    return 'Invalid date';
  }
};
