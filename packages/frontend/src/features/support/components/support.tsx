'use client';

import Image from 'next/image';
import { SupportForm } from './support-form';

export const Support = () => {
  return (
    <div className="container-wide min-h-screen">
      <div className="grid items-center gap-8 divide-x-0 divide-border py-8 lg:grid-cols-2 lg:divide-x">
        {/* Left Column - Image */}
        <div className="flex min-h-full flex-col items-center overflow-hidden rounded-2xl bg-primary-5 p-6">
          <h3 className="mb-auto font-bold">
            Have questions? Connect with us here
          </h3>
          <div className="flex flex-1 items-center">
            <Image
              src="/support/support.png"
              alt="Support background"
              width={500}
              height={500}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Column - Support Form Card */}
        <div className="w-full pl-8">
          <div className="space-y-6 rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-center font-bold">Contact Form</h3>
            <SupportForm />
          </div>
        </div>
      </div>
    </div>
  );
};
