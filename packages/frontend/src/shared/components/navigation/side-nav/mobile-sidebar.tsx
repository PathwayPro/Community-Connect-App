'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay
} from '@/shared/components/ui/dialog';
import { Sidebar } from './sidebar';
import { useSidebarStore } from '@/shared/store/sidebar.store';

export const MobileSidebar = () => {
  const { isOpen, close } = useSidebarStore();
  const [expanded, setExpanded] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <DialogOverlay className="!bg-black/30" />
      <DialogContent
        closeButton={false}
        className="fixed inset-0 z-50 translate-x-0 translate-y-0 rounded-none border-0 bg-transparent p-0 shadow-none data-[state=open]:animate-in data-[state=closed]:animate-out"
      >
        {/* Sidebar fixed to the left; keep its toggle visible */}
        <Sidebar isOpen={expanded} onToggle={setExpanded} />
        {/* Click-catcher area to close when clicking outside the sidebar */}
        <div
          className={
            expanded
              ? 'absolute inset-0 left-[260px] md:left-[260px]'
              : 'absolute inset-0 left-[92px] md:left-[92px]'
          }
          onClick={close}
        />
      </DialogContent>
    </Dialog>
  );
};
