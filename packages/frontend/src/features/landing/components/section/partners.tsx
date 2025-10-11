'use client';

import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface PartnersProps {
  className?: string;
}

const PARTNER_LOGOS = [
  { name: 'Acuspire', src: '/landing/partners/Acuspire.png' },
  { name: 'Aspentech', src: '/landing/partners/Aspentech.png' },
  { name: 'BrainSTEM Alliance', src: '/landing/partners/Brain STel.png' },
  { name: 'Canada', src: '/landing/partners/Canada.png' },
  { name: 'Calgary Economic Development', src: '/landing/partners/CED.png' },
  { name: 'CPKC', src: '/landing/partners/CPKC.png' },
  { name: 'RBC', src: '/landing/partners/rbc.png' },
  { name: 'Garmin', src: '/landing/partners/Garmin.png' },
  { name: 'Alberta Government', src: '/landing/partners/GOA.png' },
  { name: 'Hammehr', src: '/landing/partners/Hammhr.png' },
  { name: 'Long View', src: '/landing/partners/LongView.png' },
  { name: 'Manpower', src: '/landing/partners/Manpower.png' },
  { name: 'Migr8+', src: '/landing/partners/Migrate.png' },
  { name: 'Monark', src: '/landing/partners/Monark.png' },
  { name: 'Nutrien', src: '/landing/partners/Nutrien.png' },
  { name: 'PathwayPro', src: '/landing/partners/Pathways Pro.png' },
  { name: 'Simpl.AR', src: '/landing/partners/SimplAR.png' },
  { name: 'Teamit', src: '/landing/partners/Teamit.png' },
  { name: 'Techies4Tech', src: '/landing/partners/Techies4tech.png' }
] as const;

export function PartnersSection({ className }: PartnersProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden bg-background py-8 sm:py-10 lg:py-12',
        className
      )}
    >
      <h6 className="mb-8 text-center font-semibold text-neutral-dark-100">
        OUR TRUSTED PARTNERS
      </h6>

      <div className="relative w-full overflow-hidden">
        {/* Infinite marquee container */}
        <div className="flex">
          {/* Marquee track */}
          <div
            className="flex animate-marquee items-center gap-8 sm:gap-12 lg:gap-16"
            style={{ width: 'max-content' }}
          >
            {/* Render logos multiple times for seamless infinite scroll */}
            {[...Array(3)].map((_, trackIndex) =>
              PARTNER_LOGOS.map((logo) => (
                <div
                  key={`${logo.name}-track-${trackIndex}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={200}
                    height={200}
                    className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
