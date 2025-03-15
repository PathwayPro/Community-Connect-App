import { ItemCard } from '../common/item-card';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  {
    title: 'Community Connection',
    description:
      'Join a diverse and welcoming network of immigrants, mentors, and professionals who understand your journey.',
    icon: 'community',
    bgColor: 'bg-[#E1F1FF]',
    link: '/home'
  },
  {
    title: 'Explore Helpful Resources',
    description:
      'Access career tools, educational programs, and expert-curated resources designed to help you grow and succeed.',
    icon: 'resources',
    bgColor: 'bg-[#FFF0E2]',
    link: '/resources'
  },
  {
    title: 'Learn from Mentors',
    description:
      'Get personalized guidance and support from experienced mentors who have navigated similar challenges before you.',
    icon: 'mentor',
    bgColor: 'bg-[#EEEBFF]',
    link: '/mentorship'
  },
  {
    title: 'Stay Updated & Engaged',
    description:
      'Attend events, join discussions, and stay informed with the latest news, opportunities, and community updates.',
    icon: 'cloud',
    bgColor: 'bg-[#FFEFD8]',
    link: '/events'
  }
];

export function FeaturesSection() {
  const router = useRouter();

  return (
    <section id="features" className="px-16 py-[160px]">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-[120px] flex flex-col items-center gap-2 text-center">
          <h6 className="text-center font-semibold text-neutral-dark-100">
            WHY JOIN US?
          </h6>
          <h2 className="text-5xl font-semibold text-primary-500">
            Connect. Learn. Thrive.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              className="flex flex-col items-center p-4 transition-all duration-200 hover:scale-110 hover:cursor-pointer hover:rounded-3xl hover:bg-neutral-light-100 hover:shadow-xl"
              key={feature.title}
              onClick={() => {
                router.push(feature.link);
              }}
            >
              <ItemCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                bgColor={feature.bgColor}
                iconClassName="h-[64px] w-[56px]"
              />
            </div>
          ))}
        </div>
        <Link href="/home" className="mt-24">
          <Button className="px-12">Explore CommuNet</Button>
        </Link>
      </div>
    </section>
  );
}
