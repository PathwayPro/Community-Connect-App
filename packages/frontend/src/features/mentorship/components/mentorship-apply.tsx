import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import Link from 'next/link';
import { MentorshipIcons } from './icons';

export const MentorshipApply = () => {
  return (
    <Card className="mx-auto h-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="flex w-full flex-col items-center space-y-8">
        <h3 className="text-center font-semibold">Apply for Mentorship</h3>

        <p className="max-w-2xl text-center text-lg text-muted-foreground">
          Choose your path in the mentorship journey. Whether you want to share
          your knowledge or seek guidance, we&apos;re here to facilitate
          meaningful connections.
        </p>

        <div className="flex w-full flex-col items-stretch justify-between gap-8 px-2 sm:px-4 md:flex-row md:items-center md:px-8">
          <div className="flex h-full flex-1 flex-col items-center space-y-6">
            <h5 className="min-h-[60px] px-4 text-center font-medium">
              Looking for guidance to achieve your goals?
            </h5>
            <div className="flex h-[280px] w-full items-center justify-center">
              <MentorshipIcons.mentee className="h-auto w-full max-w-[260px]" />
            </div>
            <Button asChild className="w-full max-w-md">
              <Link href="/mentorship/mentee">Become a Mentee</Link>
            </Button>
          </div>

          <Separator className="my-2 md:hidden" />
          <Separator
            orientation="vertical"
            className="hidden h-[400px] border-2 md:block"
          />

          <div className="flex h-full flex-1 flex-col items-center space-y-6">
            <h5 className="min-h-[60px] px-4 text-center font-medium">
              Ready to share your expertise and guide others?
            </h5>
            <div className="flex h-[280px] w-full items-center justify-center">
              <MentorshipIcons.mentor className="h-auto w-full max-w-[380px]" />
            </div>
            <Button asChild className="w-full max-w-md">
              <Link href="/mentorship/mentor">Become a Mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MentorshipApply;
