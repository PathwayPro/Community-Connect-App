'use client';

import { useState } from 'react';
import { IconButton } from '@/shared/components/ui/icon-button';
import { ChangePasswordForm } from '@/features/settings/components/change-password';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import GeneralSettings from './general-settings';
import ReasonModal from './modals/reason-modal';

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="container-wide grid min-h-full w-full grid-cols-1 gap-6 md:grid-cols-2">
      <div className="h-full rounded-[24px] border bg-card p-6">
        <h4 className="mb-8 font-semibold">Security and Account</h4>

        <div className="space-y-4">
          <ChangePasswordForm />

          <Separator className="my-6" />
          <div>
            <h6 className="text-paragraph-lg font-semibold">Account Control</h6>

            <div className="flex flex-row justify-start gap-4">
              <Button
                variant="link"
                className="h-10 w-fit p-0 text-base"
                onClick={handleOpen}
              >
                Delete Account
              </Button>

              <ReasonModal
                isOpen={isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
              />

              <Button variant="link" className="h-10 w-fit p-0 text-base">
                Deactivate Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-full rounded-[24px] border bg-card p-6">
        <div className="mb-8 flex items-center justify-between">
          <h4 className="font-semibold">Privacy Settings</h4>
          <IconButton
            label="Save Changes"
            leftIcon="save"
            className="h-10 w-fit"
          />
        </div>
        <GeneralSettings />
      </div>
    </div>
  );
};
