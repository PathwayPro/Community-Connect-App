import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function ForumSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#E9EEFF]">
      <div className="relative z-10 mx-16">
        <div className="grid lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <p className="paragraph-lg font-medium uppercase tracking-wider text-neutral-dark-100">
                SEE WHAT&apos;S HAPPENING
              </p>
              <h1 className="font-semibold tracking-tight text-primary-500">
                Join the Conversation
              </h1>
              <p className="text-xl font-normal leading-8">
                Join conversations with fellow immigrants, mentors, and industry
                professionals. Ask questions, share experiences, and find
                support in a welcoming community that understands your journey.
              </p>
            </div>
            <Button className="h-[60px] w-fit px-12">
              <Link href="/home">Explore the Forum</Link>
            </Button>
          </div>

          {/* Forum Preview */}
          <div className="h-[700px]">
            {/* Floating avatars */}
            <div className="flex h-full w-full items-center justify-center pr-8">
              <Image
                src="/landing/forum/3.png"
                alt=""
                height={680}
                width={680}
                className="absolute h-auto w-auto"
                priority
              />
              <Image
                src="/landing/forum/2.png"
                alt=""
                height={514}
                width={514}
                className="absolute h-auto w-auto"
                priority
              />
              <Image
                src="/landing/forum/1.png"
                alt=""
                height={520}
                width={681}
                className="absolute h-auto w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50" />
      </div>
    </section>
  );
}
