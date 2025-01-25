import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { format } from 'date-fns';

interface MentorshipWaitlistProps {
  applicationDate: Date;
  activityType: string;
}

export function MentorshipWaitlist({
  applicationDate,
  activityType
}: MentorshipWaitlistProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mx-auto my-8 w-full max-w-4xl">
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
              <p>
                <span className="font-medium">Application Date:</span>{' '}
                {format(applicationDate, 'MMMM dd, yyyy')}
              </p>
              <p>
                <span className="font-medium">Activity Type:</span>{' '}
                {activityType}
              </p>
            </div>
            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Signed by Community Connect Admin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
