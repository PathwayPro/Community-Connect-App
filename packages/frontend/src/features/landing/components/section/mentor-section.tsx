import { Button } from '@/shared/components/ui/button';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ icon, title, description }: StepProps) => (
  <div className="flex flex-col items-center space-y-2 text-center">
    <div className="mb-2 rounded-full bg-opacity-20 p-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="max-w-[200px] text-sm text-gray-600">{description}</p>
  </div>
);

export function MentorSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium text-gray-600">HOW IT WORKS</p>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Find a Mentor & Grow Your Career
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Gain support from experienced mentors who have navigated the
          challenges of immigrating and building a career. Whether you need
          career advice, skill development, or industry insights, our mentors
          are here to help.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
        <Step
          icon={<div className="h-12 w-12 rounded-full bg-purple-200" />}
          title="Sign Up to the Platform"
          description="Create your profile and become part of the CommuneNet platform for free."
        />
        <Step
          icon={<div className="h-12 w-12 rounded-full bg-orange-200" />}
          title="Apply for Mentorship"
          description="Tell us about your goals and background so we can match you with the right mentor."
        />
        <Step
          icon={<div className="h-12 w-12 rounded-full bg-pink-200" />}
          title="Get Matched and Learn"
          description="Connect with your mentor for one-on-one guidance, career advice, and support."
        />
        <Step
          icon={<div className="h-12 w-12 rounded-full bg-green-200" />}
          title="Thrive and Give Back"
          description="Apply what you've learned and when you're ready, become a mentor to support others!"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline">Become a Mentor</Button>
        <Button>Apply for Mentorship</Button>
      </div>
    </section>
  );
}
