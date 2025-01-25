'use client';

import { MainNav } from '../navigation/main-nav';
import { Sidebar } from '../navigation/side-nav';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      <main
        className={`flex flex-1 flex-col ${isSidebarOpen ? 'ml-[260px]' : 'ml-[92px]'}`}
      >
        <MainNav />
        <div className="flex-1 overflow-auto bg-neutral-light-200 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
