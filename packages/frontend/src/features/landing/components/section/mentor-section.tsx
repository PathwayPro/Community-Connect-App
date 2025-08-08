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
    <section
      id="mentorship"
      className="mx-auto px-4 pt-16 sm:px-6 md:px-8 lg:pt-24"
    >
      <div className="mb-10 text-center sm:mb-16 lg:mb-24">
        <h6 className="mb-2 font-semibold text-neutral-dark-100">
          HOW IT WORKS
        </h6>
        <h2 className="mb-6 text-3xl font-semibold text-primary-500 sm:text-4xl md:text-5xl">
          Find a Mentor & Grow Your Career
        </h2>
        <p className="mx-auto max-w-2xl text-center text-base font-normal sm:text-lg md:text-xl">
          Gain support from experienced mentors who have navigated the
          challenges of immigrating and building a career. Whether you need
          career advice, skill development, or industry insights, our mentors
          are here to help.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-10 rounded-3xl bg-[#E9EEFF] p-6 sm:gap-12 sm:p-10 md:p-12 lg:gap-16 lg:p-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <ItemCard
              key={index}
              bgColor={step.bgColor}
              icon={step.icon}
              title={step.title}
              description={step.description}
              iconClassName="h-12 w-12 sm:h-[48px] sm:w-[48px] md:h-[56px] md:w-[56px] lg:h-[64px] lg:w-[61px]"
            />
          ))}
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/mentorship" className="h-12 w-full sm:h-[60px] sm:w-fit">
            <Button className="w-full px-8 sm:px-12" variant="outline">
              Become a Mentor
            </Button>
          </Link>
          <Link href="/mentorship" className="h-12 w-full sm:h-[60px] sm:w-fit">
            <Button className="w-full px-8 sm:px-12">
              Apply for Mentorship
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
