'use client';

import MenteeCard from './common/mentee-card';
import { MentorshipSection } from './common/mentorship-section';
import { useUserStore } from '@/features/user-profile/store';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { MessageSquare, Calendar } from 'lucide-react';
import { NotesCard } from './common/notes-card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { NoteEditor } from './common/note-editor';
import { useState } from 'react';

import { PastMentorsModal } from './common/modals/past-mentors-modal';

const notes = [
  {
    title: 'Session 1',
    content:
      'Discussed career goals and created a development plan. Focused on improving system design skills and architectural patterns.',
    date: new Date()
  },
  {
    title: 'Session 2',
    content:
      'Reviewed recent project challenges. Mentor suggested implementing design patterns and improving code documentation practices.',
    date: new Date()
  },
  {
    title: 'Session 3',
    content:
      'Deep dive into microservices architecture. Explored service communication patterns and discussed eventual consistency.',
    date: new Date()
  },
  {
    title: 'Session 4',
    content:
      'Code review session focusing on performance optimization. Identified areas for improvement in database query patterns.',
    date: new Date()
  },
  {
    title: 'Session 5',
    content:
      'Worked on leadership skills and team communication. Discussed strategies for leading technical discussions effectively.',
    date: new Date()
  },
  {
    title: 'Session 6',
    content:
      'Explored advanced TypeScript patterns. Covered generic types, utility types, and best practices for type-safe development.',
    date: new Date()
  },
  {
    title: 'Session 7',
    content:
      'Discussion about career progression and industry trends. Mapped out learning path for cloud-native development skills.',
    date: new Date()
  },
  {
    title: 'Session 8',
    content:
      'Technical deep dive into React performance optimization. Covered memo, useMemo, useCallback, and component structure.',
    date: new Date()
  },
  {
    title: 'Session 9',
    content:
      'Reviewed system design case study. Created architecture diagrams and discussed scalability considerations in detail.',
    date: new Date()
  },
  {
    title: 'Session 10',
    content:
      'Focused on soft skills development. Discussed techniques for effective communication in cross-functional team settings.',
    date: new Date()
  }
];

const pastMentors = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    profession: 'Software Engineer',
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: 'john.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    profession: 'Software Engineer',
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png'
  },
  {
    id: 3,
    firstName: 'John',
    lastName: 'Doe',
    profession: 'Software Engineer',
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: 'john.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png'
  },
  {
    id: 4,
    firstName: 'John',
    lastName: 'Doe',
    profession: 'Software Engineer',
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: 'john.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png'
  },
  {
    id: 5,
    firstName: 'John',
    lastName: 'Doe',
    profession: 'Software Engineer',
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: 'john.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png'
  }
];

const MenteeDashboard = () => {
  const { user } = useUserStore();
  const [isPastMentorsOpen, setIsPastMentorsOpen] = useState(false);

  const mentor = {
    fullName: user?.firstName + ' ' + user?.lastName,
    profession: user?.profession,
    company: 'Microsoft',
    expertise: 'Software Engineer',
    email: user?.email,
    avatarUrl: 'https://github.com/shadcn.png'
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <MentorshipSection className="h-auto w-full">
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
        </MentorshipSection.Header>

        <MentorshipSection.Content className="w-full">
          <div className="flex w-full gap-4">
            <div className="flex min-h-[370px] w-full flex-col justify-between rounded-2xl border-2 border-gray-200 bg-neutral-light-200 p-6">
              <div className="flex items-center justify-between">
                <h5 className="font-normal">Current Mentor</h5>

                <Button
                  className="w-fit"
                  onClick={() => setIsPastMentorsOpen(true)}
                >
                  View Past Mentors
                </Button>
              </div>

              <div className="flex justify-between gap-6">
                <div className="ml-10 flex flex-col items-center gap-3">
                  <Avatar className="h-[120px] w-[120px]">
                    <AvatarImage src={mentor?.avatarUrl} alt="Mentor avatar" />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <h6 className="text-center font-semibold">
                    {mentor?.fullName}
                  </h6>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-dark-100">
                      Profession:{' '}
                      <span className="font-normal text-neutral-dark-600">
                        {mentor?.profession}
                      </span>
                    </p>
                    <p className="text-lg font-medium text-neutral-dark-100">
                      Company:{' '}
                      <span className="font-normal text-neutral-dark-600">
                        {mentor?.company}
                      </span>
                    </p>

                    <p className="text-lg font-medium text-neutral-dark-100">
                      Field of Expertise:{' '}
                      <span className="font-normal text-neutral-dark-600">
                        {mentor?.expertise}
                      </span>
                    </p>

                    <p className="text-lg font-medium text-neutral-dark-100">
                      Email:{' '}
                      <span className="font-normal text-neutral-dark-600">
                        {mentor?.email}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex h-10 w-full items-center gap-2"
                  variant="outline"
                >
                  <MessageSquare className="h-5 w-5" />
                  Message
                </Button>

                <Button className="flex h-10 w-full items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book a Session
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <MenteeCard
                title="Mentrorship Started"
                value="09/01/2025"
                icon="calendar"
              />
              <MenteeCard
                title="Session Attended"
                value="64"
                icon="liveSessions"
              />
              <MenteeCard
                title="Next Session"
                value="12:00 PM, 12/01/2025"
                icon="calendar"
              />
            </div>
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>
      <MentorshipSection className="h-auto w-full">
        <div className="flex w-full gap-4">
          <div className="flex w-1/4 flex-col gap-4">
            <MentorshipSection.Header>
              <h6 className="font-semibold">Session Notes</h6>
            </MentorshipSection.Header>

            <MentorshipSection.Content>
              <ScrollArea className="h-[400px] pr-4">
                <div className="flex flex-col gap-4">
                  {notes.map((note) => (
                    <NotesCard
                      key={note.title}
                      title={note.title}
                      content={note.content}
                      date={note.date}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </ScrollArea>
            </MentorshipSection.Content>
          </div>

          <div className="flex w-3/4 flex-col gap-4">
            <MentorshipSection.Header>
              <h6 className="font-semibold">Take Notes</h6>
            </MentorshipSection.Header>

            <MentorshipSection.Content>
              <NoteEditor />
            </MentorshipSection.Content>
          </div>
        </div>
      </MentorshipSection>
      <PastMentorsModal
        isOpen={isPastMentorsOpen}
        onClose={() => setIsPastMentorsOpen(false)}
        mentors={pastMentors}
        setIsPastMentorsOpen={setIsPastMentorsOpen}
      />
    </div>
  );
};

export default MenteeDashboard;
