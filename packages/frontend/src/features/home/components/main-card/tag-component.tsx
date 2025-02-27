import { Card } from '@/shared/components/ui/card';

interface Tag {
  id: string;
  label: string;
}

const TAGS: Tag[] = [
  { id: 'all', label: 'All Tags' },
  { id: 'career', label: 'Career' },
  { id: 'mentorship', label: 'Mentorship' },
  { id: 'events', label: 'Events' },
  { id: 'books', label: 'Books' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'education', label: 'Education' },
  { id: 'documentaries', label: 'Documentaries' },
  { id: 'software-development', label: 'Software Development' },
  { id: 'data-analytics', label: 'Data Analytics' },
  { id: 'design', label: 'Design' }
];

interface TagComponentProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export const TagComponent = ({
  selectedTags,
  setSelectedTags
}: TagComponentProps) => {
  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
  };

  return (
    <Card className="mt-6 flex flex-col gap-2 p-4">
      <div className="flex flex-wrap gap-2 text-neutral-dark-200">Tags</div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              selectedTags.includes(tag.id)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } `}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </Card>
  );
};
