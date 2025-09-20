'use client';

import { MainNav } from '../navigation/main-nav';
import { Sidebar, MobileSidebar } from '../navigation/side-nav';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/shared/store/sidebar.store';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { open } = useSidebarStore();

  return (
    <div className="flex h-screen w-full">
      {/* Permanent sidebar for md+ */}
      <div className="hidden md:block">
        <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      </div>

      {/* Mobile drawer */}
      <MobileSidebar />

      <main
        className={`flex flex-1 flex-col ${isSidebarOpen ? 'md:ml-[260px]' : 'md:ml-[92px]'}`}
      >
        {/* Keep a fixed 56px top bar to avoid stretching when content is short */}
        <div className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <button
            aria-label="Open menu"
            onClick={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <MainNav />
          </div>
        </div>
        <div className="flex-1 bg-neutral-light-200 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
