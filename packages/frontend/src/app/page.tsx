import { Button } from '@/components/ui/button';
import {
  TextH1,
  TextH2,
  TextH3,
  TextH4,
  TextLead,
  TextP,
  TextLarge,
  TextSmall,
  TextMuted
} from '@/components/typography/typography';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>Shadcn UI Test Button</Button>

      <div className="container-default py-8">
        <TextH1>Welcome to our site - H1</TextH1>
        <TextH2>Welcome to our site - H2</TextH2>
        <TextH3>Welcome to our site - H3</TextH3>
        <TextH4>Welcome to our site - H4</TextH4>
        <TextLead>
          This is a lead paragraph that introduces the main content.
        </TextLead>
        <TextP>
          Regular paragraph text with consistent styling and spacing.
        </TextP>
        <TextLarge>Large text</TextLarge>
        <TextSmall>Small text</TextSmall>
        <TextMuted>Muted text</TextMuted>
      </div>
    </div>
  );
}
