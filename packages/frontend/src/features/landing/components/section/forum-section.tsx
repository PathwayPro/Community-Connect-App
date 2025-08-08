import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function ForumSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#E9EEFF] px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-24">
      <div className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <p className="paragraph-lg font-medium uppercase tracking-wider text-neutral-dark-100">
                SEE WHAT&apos;S HAPPENING
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-primary-500 sm:text-4xl md:text-5xl">
                Join the Conversation
              </h1>
              <p className="text-base font-normal leading-7 sm:text-lg md:text-xl md:leading-8">
                Join conversations with fellow immigrants, mentors, and industry
                professionals. Ask questions, share experiences, and find
                support in a welcoming community that understands your journey.
              </p>
            </div>
            <Button className="h-12 w-fit px-8 sm:h-[60px] sm:px-12">
              <Link href="/home">Explore the Forum</Link>
            </Button>
          </div>

          {/* Forum illustration */}
          <div className="relative h-[360px] sm:h-[480px] md:h-[560px] lg:h-[700px] xl:h-[800px]">
            <Image
              src="/landing/forum/2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 480px"
              className="object-contain"
              priority
            />
            <Image
              src="/landing/forum/3.png"
              alt="Forum illustration"
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 640px"
              className="object-contain"
              priority
            />
            <Image
              src="/landing/forum/1.png"
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 480px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 hidden h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50 sm:block" />
      </div>
    </section>
  );
}
