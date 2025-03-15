import { format } from 'date-fns';

interface NotesCardProps {
  title: string;
  content: string;
  date: Date;
  onClick: () => void;
}

export function NotesCard({ title, content, date, onClick }: NotesCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex h-[150px] cursor-pointer flex-col justify-between rounded-2xl bg-neutral-light-200 p-4 transition-colors duration-200 hover:bg-neutral-light-300"
    >
      <div>
        <h3 className="line-clamp-1 text-paragraph-lg font-semibold">
          {title}
        </h3>
        <p className="line-clamp-2 text-neutral-dark-400">{content}</p>
      </div>

      <div className="self-end text-sm text-neutral-dark-300">
        {format(date, 'MMM d, yyyy')}
      </div>
    </div>
  );
}
