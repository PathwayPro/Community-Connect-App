import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="">
      <div className="relative mx-auto max-w-7xl pt-[160px]"></div>
      <div className="relative mx-auto max-w-7xl rounded-2xl bg-[#E8EDFF] px-[64px]">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <p className="paragraph-lg font-medium uppercase tracking-wider text-neutral-dark-100">
                OUR STORY
              </p>
              <h1 className="font-semibold tracking-tight text-primary-500">
                About Us
              </h1>
              <p className="paragraph-lg font-normal">
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

          {/* Forum Preview */}
          <div className="h-[700px]">
            {/* Floating avatars */}
            <div className="flex h-full w-full items-center justify-center pr-8">
              <Image
                src="/landing/about/image.png"
                alt=""
                height={680}
                width={680}
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
