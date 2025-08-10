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
import { useEffect, useMemo, useState } from 'react';
import { useMentorshipStore } from '../store';
import { PastMentorsModal } from './common/modals/past-mentors-modal';

const MenteeDashboard = () => {
  const { user } = useUserStore();
  const [isPastMentorsOpen, setIsPastMentorsOpen] = useState(false);
  const {
    menteeDashboard,
    menteeNotes,
    pastMentors,
    getMenteeDashboard,
    getMenteeNotes,
    getMenteePastMentors
  } = useMentorshipStore();

  useEffect(() => {
    // Load mentee dashboard data on mount
    getMenteeDashboard().catch(() => {});
    getMenteeNotes().catch(() => {});
    getMenteePastMentors().catch(() => {});
  }, [getMenteeDashboard, getMenteeNotes, getMenteePastMentors]);

  const mentor = useMemo(() => {
    const m = menteeDashboard?.mentor;
    if (m) {
      return {
        fullName: `${m.firstName} ${m.lastName}`,
        profession: m.profession,
        company: m.company,
        expertise: m.expertise,
        email: m.email,
        avatarUrl: m.avatarUrl
      };
    }
    return {
      fullName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
      profession: user?.profession,
      company: undefined,
      expertise: undefined,
      email: user?.email,
      avatarUrl: undefined
    };
  }, [menteeDashboard, user]);

  return (
    <div className="container-wide flex w-full flex-col gap-6">
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
                value={
                  menteeDashboard?.mentorshipStarted
                    ? new Date(
                        menteeDashboard.mentorshipStarted
                      ).toLocaleDateString()
                    : '-'
                }
                icon="calendar"
              />
              <MenteeCard
                title="Session Attended"
                value={(menteeDashboard?.sessionsAttended ?? 0).toString()}
                icon="liveSessions"
              />
              <MenteeCard
                title="Next Session"
                value={
                  menteeDashboard?.nextSession
                    ? new Date(menteeDashboard.nextSession).toLocaleString()
                    : '-'
                }
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
                  {menteeNotes.map((note) => (
                    <NotesCard
                      key={`${note.title}-${note.date}`}
                      title={note.title}
                      content={note.content}
                      date={new Date(note.date)}
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
              <NoteEditor onSubmit={() => {}} />
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
