import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export const MentorshipApply = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-8 px-4 py-8">
      <h3 className="text-center text-2xl font-semibold">
        Apply for Mentorship
      </h3>

      <p className="text-center text-muted-foreground">
        Join our mentorship program to either share your expertise as a mentor
        or accelerate your growth as a mentee. Our platform connects passionate
        developers to create meaningful learning relationships and foster
        professional development.
      </p>

      <div className="flex w-full justify-between gap-4">
        <Button asChild className="w-full">
          <Link href="/mentorship/apply/mentor">Become a Mentor</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/mentorship/apply/mentee">Become a Mentee</Link>
        </Button>
      </div>
    </div>
  );
};

export default MentorshipApply;
