import React from 'react';
import { cn } from '@/shared/lib/utils';

interface MentorshipSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface MentorshipSectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MentorshipSectionContentProps {
  children: React.ReactNode;
  className?: string;
}

const MentorshipSection = ({ children, className }: MentorshipSectionProps) => {
  return (
    <div
      className={cn(
        'flex h-[252px] w-full flex-col items-center gap-6 rounded-2xl bg-neutral-light-100 p-4 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

const MentorshipSectionHeader = ({
  children,
  className
}: MentorshipSectionHeaderProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-4',
        className
      )}
    >
      {children}
    </div>
  );
};

const MentorshipSectionContent = ({
  children,
  className
}: MentorshipSectionContentProps) => {
  return <div className={cn('w-full', className)}>{children}</div>;
};

// Attach subcomponents
MentorshipSection.Header = MentorshipSectionHeader;
MentorshipSection.Content = MentorshipSectionContent;

export { MentorshipSection };
