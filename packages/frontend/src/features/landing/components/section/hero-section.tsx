import { Button } from '@/shared/components/ui/button';
import { HeroImageSVG } from '@/features/landing/components/common/assets/hero';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="home" className="">
      <div className="relative mx-auto max-w-7xl pt-[160px]"></div>
      <div className="relative mx-auto max-w-7xl rounded-2xl bg-[#E8EDFF] px-[64px] py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content column */}
          <div className="text-left">
            <h1 className="text-[64px] font-semibold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Your <span className="text-primary">Pathway to Growth</span>,
              Support and Community
            </h1>
            <h5 className="mt-4 font-normal">
              CommuniNet helps immigrants find mentorship, career opportunities,
              and a supportive network—your new beginning starts here.
            </h5>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button className="bg-primary px-8">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Right image column */}
          <div className="relative h-full w-full">
            <HeroImageSVG.hero className="h-auto w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
