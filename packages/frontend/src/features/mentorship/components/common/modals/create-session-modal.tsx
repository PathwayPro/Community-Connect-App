import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useState } from 'react';
import { useMentorshipStore } from '../../../store';
import { CreateMentorshipSessionDto } from '../../../types';

interface CreateSessionModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateSessionModal({
  isOpen,
  setOpen
}: CreateSessionModalProps) {
  const { mentorMentees, createMentorshipSession, getMyUpcomingSessions } =
    useMentorshipStore();

  const approvedMentees = mentorMentees.filter((m) => m.status === 'APPROVED');

  const [form, setForm] = useState<{
    menteeId: number | '';
    link: string;
    dateStart: string;
    dateEnd: string;
    description: string;
  }>({ menteeId: '', link: '', dateStart: '', dateEnd: '', description: '' });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'menteeId' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.menteeId || !form.link || !form.dateStart || !form.dateEnd) {
      setError('Please fill all required fields.');
      return;
    }

    // Ensure selected mentee has an APPROVED matching
    // const isApproved = approvedMentees.some((m) => m.id === form.menteeId);
    // if (!isApproved) {
    //   setError('You can only schedule sessions with APPROVED mentees.');
    //   return;
    // }

    const payload: CreateMentorshipSessionDto = {
      menteeId: Number(form.menteeId),
      link: form.link,
      dateStart: new Date(form.dateStart).toISOString(),
      dateEnd: new Date(form.dateEnd).toISOString(),
      description: form.description || undefined
    };

    try {
      setSubmitting(true);
      await createMentorshipSession(payload);
      // Optionally refresh upcoming sessions list
      await getMyUpcomingSessions();
      setOpen(false);
      setForm({
        menteeId: '',
        link: '',
        dateStart: '',
        dateEnd: '',
        description: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-[552px] max-w-[552px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Create Mentorship Session
          </DialogTitle>
          <DialogDescription className="sr-only">
            Schedule a new mentorship session with a mentee.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[450px] rounded-2xl bg-neutral-light-300 p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Mentee</label>
              <select
                name="menteeId"
                value={form.menteeId}
                onChange={handleChange}
                className="rounded-md border bg-white p-2 text-sm"
                required
              >
                <option value="" disabled>
                  Select a mentee
                </option>
                {approvedMentees.map((m) => (
                  <option key={m.id} value={m.menteeUserId ?? m.id}>
                    {m.mentee} ({m.email})
                  </option>
                ))}
              </select>
              {approvedMentees.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  You currently have no approved mentees to schedule with.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Call Link</label>
              <input
                type="url"
                name="link"
                placeholder="https://meet.google.com/..."
                value={form.link}
                onChange={handleChange}
                className="rounded-md border bg-white p-2 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Start</label>
                <input
                  type="datetime-local"
                  name="dateStart"
                  value={form.dateStart}
                  onChange={handleChange}
                  className="rounded-md border bg-white p-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">End</label>
                <input
                  type="datetime-local"
                  name="dateEnd"
                  value={form.dateEnd}
                  onChange={handleChange}
                  className="rounded-md border bg-white p-2 text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="min-h-[80px] rounded-md border bg-white p-2 text-sm"
                placeholder="What will this session cover?"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="mx-auto h-10 w-full"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="mx-auto h-10 w-full"
                disabled={submitting || approvedMentees.length === 0}
              >
                {submitting ? 'Creating...' : 'Create Session'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
