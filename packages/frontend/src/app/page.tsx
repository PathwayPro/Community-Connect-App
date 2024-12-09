import { Button } from '@/components/ui/button';
import {
  Display,
  HeadingH1,
  HeadingH2,
  HeadingH3,
  HeadingH4,
  HeadingH5,
  HeadingH6,
  Lead,
  Muted,
  Paragraph
} from '@/components/typography/typography';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>Shadcn UI Test Button</Button>

      <div className="container-default py-8">
        <Display size="lg">Display Text</Display>
        <Display size="sm">Display Text</Display>
        <HeadingH1>Welcome to our site - H1</HeadingH1>
        <HeadingH2>Welcome to our site - H2</HeadingH2>
        <HeadingH3>Welcome to our site - H3</HeadingH3>
        <HeadingH4>Welcome to our site - H4</HeadingH4>
        <HeadingH5>Welcome to our site - H5</HeadingH5>
        <HeadingH6>Welcome to our site - H6</HeadingH6>
        <Paragraph size="lg">
          This is a lead paragraph that introduces the main content.
        </Paragraph>
        <Paragraph size="base">
          Regular paragraph text with consistent styling and spacing.
        </Paragraph>
        <Paragraph size="sm">Small text</Paragraph>
        <Lead>Lead text</Lead>
        <Muted>Muted text</Muted>
      </div>
    </div>
  );
}
