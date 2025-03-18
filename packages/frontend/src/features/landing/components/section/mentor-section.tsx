import { Button } from '@/shared/components/ui/button';
import { ItemCard } from '../common/item-card';
import { ItemCardProps } from '@/features/landing/types';
import Link from 'next/link';

const steps: ItemCardProps[] = [
  {
    title: 'Sign Up to the Platform',
    description:
      'Create your profile and become part of the CommuneNet platform for free.',
    icon: 'pen',
    bgColor: 'bg-[#E3DFFF]'
  },
  {
    title: 'Apply for Mentorship',
    description:
      'Tell us about your goals and background so we can match you with the right mentor.',
    icon: 'document',
    bgColor: 'bg-[#FFEAE2]'
  },
  {
    title: 'Get Matched and Learn',
    description:
      'Connect with your mentor for one-on-one guidance, career advice, and support.',
    icon: 'search',
    bgColor: 'bg-[#FFE2EB]'
  },
  {
    title: 'Thrive and Help Others',
    description:
      "Apply what you've learned and when you're ready, become a mentor to support others!",
    icon: 'tick',
    bgColor: 'bg-[#D7FFD7]'
  }
];

export function MentorSection() {
  return (
    <section id="mentorship" className="mx-auto pt-[160px]">
      <div className="mb-[120px] text-center">
        <h6 className="mb-2 font-semibold text-neutral-dark-100">
          HOW IT WORKS
        </h6>
        <h2 className="mb-6 text-5xl font-semibold text-primary-500">
          Find a Mentor & Grow Your Career
        </h2>
        <p className="mx-auto max-w-2xl text-center text-xl font-normal">
          Gain support from experienced mentors who have navigated the
          challenges of immigrating and building a career. Whether you need
          career advice, skill development, or industry insights, our mentors
          are here to help.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-24 rounded-3xl bg-[#E9EEFF] p-16">
        <div className="flex items-start gap-8">
          {steps.map((step, index) => (
            <ItemCard
              key={index}
              bgColor={step.bgColor}
              icon={step.icon}
              title={step.title}
              description={step.description}
              iconClassName="h-[64px] w-[61px]"
            />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/mentorship" className="h-[60px] w-fit">
            <Button className="px-12" variant="outline">
              Become a Mentor
            </Button>
          </Link>
          <Link href="/mentorship" className="h-[60px] w-fit">
            <Button className="px-12">Apply for Mentorship</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
