'use client';

import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface PartnersProps {
  className?: string;
}

const PARTNER_LOGOS = [
  { name: 'Upstart', src: '/landing/partners/upstart.png' },
  { name: 'Sonos', src: '/landing/partners/sonos.png' },
  { name: 'Coinbase', src: '/landing/partners/coinbase.png' },
  { name: 'Betty Labs', src: '/landing/partners/betty-labs.png' },
  { name: 'Masterclass', src: '/landing/partners/masterclass.png' }
] as const;

export function PartnersSection({ className }: PartnersProps) {
  return (
    <div
      className={cn('w-full overflow-hidden bg-background py-12', className)}
    >
      <h6 className="mb-8 text-center font-semibold text-neutral-dark-100">
        OUR TRUSTED PARTNERS
      </h6>

      <div className="relative flex overflow-x-hidden">
        {/* First scroll container */}
        <div className="flex min-w-full animate-marquee items-center justify-around">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="mx-8 flex h-[120px] w-[120px] items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={120}
                height={120}
                className="h-full w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex min-w-full animate-marquee items-center justify-around">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={`${logo.name}-duplicate`}
              className="mx-8 flex h-[120px] w-[120px] items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={120}
                height={120}
                className="h-full w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
