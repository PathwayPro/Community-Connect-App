'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/shared/components/ui/carousel';
import { Card, CardContent } from '@/shared/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { type CarouselApi } from '@/shared/components/ui/carousel';

interface CarouselSlide {
  title: string;
  imageSrc: string;
}

const slides: CarouselSlide[] = [
  {
    title: 'Empowering Immigrants Through Connections',
    imageSrc: '/auth/auth-image-1.png'
  },
  {
    title: 'Championing Immigrants Through an Inclusive Community',
    imageSrc: '/auth/auth-image-2.png'
  }
];

const AuthCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Update current slide when carousel changes
    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });

    // Continuous auto-slide timer with wrap-around
    const autoSlideInterval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      api.scrollTo(nextSlide);
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [api, currentSlide]);

  return (
    <Carousel className="relative h-full w-full" setApi={setApi}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <Card className="h-full w-full rounded-2xl border-none bg-primary-5">
              <CardContent className="flex h-[80vh] flex-col items-center p-6">
                <h1 className="mt-4 text-start text-display-sm font-medium">
                  {slide.title}
                </h1>
                <div className="relative h-full w-full">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.title}
                    fill
                    className="rounded-lg object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-5 left-0 right-0 mx-auto flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              currentSlide === index
                ? 'bg-secondary-100'
                : 'bg-neutral-light-100'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default AuthCarousel;
