import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SharedIcons } from '@/shared/components/icons';

interface FeaturedLink {
  title: string;
  href: string;
}

interface Posts {
  title: string;
  href: string;
}

const posts: Posts[] = [
  {
    title: 'Random item title that users can navigate to',
    href: '#'
  }
];

const featuredLinks: FeaturedLink[] = [
  {
    title: 'Random item title that users can navigate to',
    href: '#'
  },
  {
    title: 'Random item title that users can navigate to',
    href: '#'
  },
  {
    title: 'Random item title that users can navigate to',
    href: '#'
  }
];

const LinkItem = ({ title, href }: { title: string; href: string }) => {
  return (
    <Link
      href={href}
      className="flex items-start gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted hover:text-primary hover:underline"
    >
      <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <span className="text-sm">{title}</span>
    </Link>
  );
};

export const HomeInfobar = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <SharedIcons.info className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Important Posts</h2>
        </div>
        {posts.map((post, index) => (
          <LinkItem key={index} title={post.title} href={post.href} />
        ))}

        <div className="flex items-center gap-2 pt-6">
          <SharedIcons.link className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Featured Links</h2>
        </div>
        {featuredLinks.map((link, index) => (
          <LinkItem key={index} title={link.title} href={link.href} />
        ))}
      </div>
    </div>
  );
};
