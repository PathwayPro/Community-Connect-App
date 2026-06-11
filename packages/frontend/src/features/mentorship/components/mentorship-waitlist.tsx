import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { format } from 'date-fns';

interface MentorshipWaitlistProps {
  applicationDate: string | null;
  activityType: string | null;
  applicationStatus: string | null;
}

const parseDateString = (dateString: string): Date => {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    console.log(
      'Invalid date string received by MentorshipWaitlist:',
      dateString,
      'returning current date.'
    );
    return new Date(); // Fallback
  }
  return parsedDate;
};

export function MentorshipWaitlist({
  applicationDate,
  activityType,
  applicationStatus
}: MentorshipWaitlistProps) {
  const dateObject = applicationDate ? parseDateString(applicationDate) : null;

  const formattedDisplayDate = dateObject
    ? (() => {
        try {
          const result = format(dateObject, 'MMMM dd, yyyy');
          return result;
        } catch (error) {
          console.error('Error formatting date in MentorshipWaitlist:', error);
          return 'Date not available';
        }
      })()
    : null;

  return (
    <div className="flex h-full w-full items-center justify-center px-4 md:px-0">
      <Card className="mx-auto my-8 w-full max-w-3xl sm:max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Application In Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              Thank you for applying to our mentorship program. Your application
              is currently under review.
            </p>
            <div className="space-y-2">
              {formattedDisplayDate && (
                <p>
                  <span className="font-medium">Application Date:</span>{' '}
                  {formattedDisplayDate}
                </p>
              )}
              {activityType && (
                <p>
                  <span className="font-medium">Activity Type:</span>{' '}
                  {activityType}
                </p>
              )}
              {applicationStatus && (
                <p>
                  <span className="font-medium">Application Status:</span>{' '}
                  {applicationStatus}
                </p>
              )}
            </div>
            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Signed by CommuNet Admin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
