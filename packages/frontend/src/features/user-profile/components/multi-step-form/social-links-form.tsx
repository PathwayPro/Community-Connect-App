import { useState } from 'react';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui/button';
import { SharedIcons } from '@/shared/components/icons';

export const SocialLinksForm = () => {
  const [additionalLinks, setAdditionalLinks] = useState<number[]>([]);

  const handleAddLink = () => {
    setAdditionalLinks((prev) => [...prev, prev.length]);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <FormInput
        name="linkedin"
        label="LinkedIn"
        hasLabelInput={true}
        leftLabel="https://"
        placeholder="Enter your LinkedIn profile URL"
        customError="LinkedIn profile URL is required"
      />
      <FormInput
        name="twitter"
        label="Twitter"
        hasLabelInput={true}
        leftLabel="https://"
        placeholder="Enter your Twitter profile URL"
      />
      <FormInput
        name="github"
        label="GitHub"
        hasLabelInput={true}
        leftLabel="https://"
        placeholder="Enter your GitHub profile URL"
      />
      <FormInput
        name="portfolio"
        label="Portfolio"
        hasLabelInput={true}
        leftLabel="https://"
        placeholder="Enter your portfolio URL"
      />
      <FormInput
        name="others"
        label="Other Links (Behance, Dribble, Instagram etc.)"
        hasLabelInput={true}
        leftLabel="https://"
        placeholder="Enter your other links"
      />

      {additionalLinks.map((index) => (
        <FormInput
          key={`additional-link-${index}`}
          name={`additional-link-${index}`}
          label={`Additional Link ${index + 1}`}
          hasLabelInput={true}
          leftLabel="https://"
          placeholder="Enter your link"
        />
      ))}

      <Button
        variant="ghost"
        className="flex w-[152px] items-center justify-start gap-2 p-0 text-lg font-medium text-primary hover:bg-white"
        onClick={handleAddLink}
      >
        <SharedIcons.plusCircle className="h-6 w-6" />
        Add More Links
      </Button>
    </div>
  );
};
