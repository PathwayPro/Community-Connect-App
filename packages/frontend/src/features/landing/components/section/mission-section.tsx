import { ItemCard } from '../common/item-card';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Our Mission',
    description:
      'Our mission is to bridge the gap for immigrant professionals in tech. By fostering connections, sharing knowledge, and providing access to opportunities, we empower skilled immigrants to thrive and lead in the industry.',
    icon: 'lightbulb',
    bgColor: 'bg-[#FFF5EA]'
  },
  {
    title: 'Our Vision',
    description:
      'We strive to build a united and diverse tech community where immigrant professionals can thrive, collaborate, and make meaningful contributions. CommuNet is your go-to platform for networking, mentorship, and growth—regardless of background.',
    icon: 'target',
    bgColor: 'bg-[#FFDEDE]'
  }
];

export function MissionSection() {
  return (
    <section id="mission" className="px-16 pt-[160px]">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-[120px] flex flex-col items-center gap-2 text-center">
          <h6 className="text-center font-semibold text-neutral-dark-100">
            WHO WE ARE
          </h6>
          <h2 className="text-5xl font-semibold text-primary-500">
            Empowering Immigrant Success
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {features.map((feature) => (
            <ItemCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              bgColor={feature.bgColor}
              iconClassName="h-[61px] w-[61px]"
            />
          ))}
        </div>
        <Link href="/home" className="mt-24">
          <Button className="px-12">Explore CommuNet</Button>
        </Link>
      </div>
    </section>
  );
}
