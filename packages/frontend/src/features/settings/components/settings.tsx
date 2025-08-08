'use client';

import { useState } from 'react';
import { ChangePasswordForm } from '@/features/settings/components/change-password';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { GeneralSettings } from './general-settings';
import ReasonModal from './modals/reason-modal';
import { useUserStore } from '@/features/user-profile/store';
import { useEffect } from 'react';

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, fetchUserProfile } = useUserStore();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  const isLocalAuth = user?.provider === 'email';

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    console.log('Confirm');
  };

  return (
    <div
      className={`container-wide grid min-h-full w-full gap-6 px-4 md:px-0 ${
        isLocalAuth
          ? 'grid-cols-1 items-start md:grid-cols-2'
          : 'grid-cols-1 place-items-center'
      }`}
    >
      {isLocalAuth && (
        <div className="h-full rounded-[24px] border bg-card p-4 sm:p-6">
          <h4 className="mb-8 font-semibold">Security and Account</h4>

          <div className="space-y-4">
            <ChangePasswordForm />
          </div>
        </div>
      )}

      <div
        className={`min-h-full rounded-[24px] border bg-card p-4 sm:p-6 ${
          !isLocalAuth ? 'w-full max-w-lg' : ''
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h4 className="font-semibold">Privacy Settings</h4>
        </div>
        <GeneralSettings />

        <Separator className="my-6" />
        <div>
          <h6 className="text-paragraph-lg font-semibold">Account Control</h6>

          <div className="flex flex-row flex-wrap justify-start gap-4">
            <Button
              variant="link"
              className="h-10 w-fit p-0 text-base hover:text-destructive"
              onClick={handleOpen}
            >
              Delete Account
            </Button>

            <ReasonModal
              isOpen={isOpen}
              onClose={handleClose}
              onConfirm={handleConfirm}
            />

            {/* <Button variant="link" className="h-10 w-fit p-0 text-base">
              Deactivate Account
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
