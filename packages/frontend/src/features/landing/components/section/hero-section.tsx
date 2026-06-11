import { Button } from '@/shared/components/ui/button';
import { HeroImageSVG } from '@/features/landing/components/common/assets/hero';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="home" className="pt-24 sm:pt-28 md:pt-36">
      <div className="relative mx-auto max-w-7xl rounded-2xl bg-[#E8EDFF] px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-16 lg:px-16 lg:py-20">
        <div className="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2">
          {/* Left content column */}
          <div className="text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Your <span className="text-primary">Pathway to Growth</span>,
              Support and Community
            </h1>
            <h5 className="mt-4 font-normal">
              CommuNet helps immigrants find mentorship, career opportunities,
              and a supportive network—your new beginning starts here.
            </h5>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button className="bg-primary px-8">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Right image column */}
          <div className="relative order-first h-full w-full lg:order-none">
            <HeroImageSVG.hero className="h-auto w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
