import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="pt-16 sm:pt-20 md:pt-24">
      <div className="relative mx-auto max-w-7xl rounded-2xl bg-[#E8EDFF] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <p className="paragraph-lg font-medium uppercase tracking-wider text-neutral-dark-100">
                OUR STORY
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-primary-500 sm:text-4xl md:text-5xl">
                About Us
              </h1>
              <p className="text-base font-normal leading-7 sm:text-lg md:text-xl md:leading-9">
                In 2019, Wunmi Adekanmbi discovered Alberta’s thriving tech
                scene but also noticed a lack of diversity. Determined to create
                a more inclusive space, she founded Immigrant Techies Alberta, a
                grassroots movement to connect skilled immigrants with
                opportunities in tech. Today, CommuNet carries that mission
                forward—empowering immigrant professionals with mentorship,
                networking, and career resources.
              </p>
            </div>
          </div>

          {/* About illustration */}
          <div className="relative h-[320px] sm:h-[420px] md:h-[560px] lg:h-[700px] xl:h-[800px]">
            <Image
              src="/landing/about/image.png"
              alt="About illustration"
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 640px"
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
