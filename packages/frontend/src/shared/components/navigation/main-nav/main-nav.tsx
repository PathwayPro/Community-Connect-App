import Image from 'next/image';
import { IconInput } from '@/shared/components/ui/icon-input';
import BreadcrumbNav from './breadcrumb-nav';

export const MainNav = () => {
  return (
    <div className="sticky top-0 z-30 h-20 w-full border-b bg-white">
      <div className="flex h-full items-center justify-between px-8">
        <BreadcrumbNav />
        <div className="flex items-center gap-4">
          <IconInput
            leftIcon="search"
            className="w-[250px] rounded-full bg-neutral-light-100"
            placeholder="Search"
          />
          <Image
            src="/profile/profile.png"
            alt="user profile"
            width={40}
            height={40}
            className="rounded-full bg-warning-500"
            priority
          />
        </div>
      </div>
    </div>
  );
};
