'use client';

import { Features } from '@/features/landing/components/common/assets/features';
import { cn } from '@/shared/lib/utils';
import { ItemCardProps } from '@/features/landing/types';

export const ItemCard = ({
  title,
  description,
  icon,
  bgColor
}: ItemCardProps) => {
  const Icon = Features[icon as keyof typeof Features];

  if (!Icon) {
    console.warn(`Icon "${icon}" not found in Features`);
    return null;
  }

  return (
    <div className="flex max-w-[264px] flex-col items-center gap-4">
      <div
        className={cn(
          `mb-4 flex h-[112px] w-[104px] items-center justify-center rounded-3xl`,
          bgColor
        )}
      >
        <Icon className="h-[64px] w-[56px]" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="whitespace-pre-line text-center font-medium leading-tight text-primary">
          {title}
        </h3>
        <p className="paragraph-lg text-center font-normal">{description}</p>
      </div>
    </div>
  );
};
