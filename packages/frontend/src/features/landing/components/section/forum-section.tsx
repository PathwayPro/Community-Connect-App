import Image from "next/image"
import Link from "next/link"

export function ForumSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="container relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
                SEE WHAT&apos;S HAPPENING
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Join the Conversation
              </h2>
              <p className="text-lg text-slate-600">
                Join conversations with fellow immigrants, mentors, and industry professionals. Ask
                questions, share experiences, and find support in a welcoming community that
                understands your journey.
              </p>
            </div>
            <div>
              <Link
                href="/forum"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Explore the Forum
              </Link>
            </div>
          </div>

          {/* Forum Preview */}
          <div className="relative">
            {/* Forum messages mockup */}
            <div className="relative">
              <Image
                src="/images/forum-preview.png"
                alt="Forum conversation preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>

            {/* Floating avatars */}
            <div className="absolute inset-0 -z-10">
              {/* Add multiple avatar images with absolute positioning */}
              <Image
                src="/images/avatar-1.png"
                alt=""
                width={48}
                height={48}
                className="absolute left-0 top-0 rounded-full"
              />
              <Image
                src="/images/avatar-2.png"
                alt=""
                width={48}
                height={48}
                className="absolute right-12 top-4 rounded-full"
              />
              <Image
                src="/images/avatar-3.png"
                alt=""
                width={48}
                height={48}
                className="absolute bottom-12 left-8 rounded-full"
              />
              {/* Add more avatars as needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50" />
      </div>
    </section>
  )
}
