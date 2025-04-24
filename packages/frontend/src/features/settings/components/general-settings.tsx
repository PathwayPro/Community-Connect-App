'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form';
import { SaveIcon } from 'lucide-react';
import { useSettingsStore } from '../store';
import { useEffect } from 'react';
import { ProfileVisibility } from '../types';
import {
  formSchema,
  GeneralSettingsFormValues
} from '../lib/validation/settings-validation';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';

const privacyOptions = [
  { id: 'shareBirthDate', label: 'Share Birth Date' },
  { id: 'shareContactDetails', label: 'Share Contact Details' },
  { id: 'shareSocialLinks', label: 'Share Social Links' }
];

const visibilityOptions = [
  { value: ProfileVisibility.PUBLIC, label: 'Public' },
  { value: ProfileVisibility.PRIVATE, label: 'Private' },
  { value: ProfileVisibility.CONNECTIONS_ONLY, label: 'Connections Only' }
];

export const GeneralSettings = () => {
  const { settings, updateSettings, getSettings } = useSettingsStore();
  const { showAlert } = useAlertDialog();

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shareBirthDate: settings?.shareBirthDate ?? true,
      shareContactDetails: settings?.shareContactDetails ?? false,
      shareSocialLinks: settings?.shareSocialLinks ?? true,
      profileVisibility: settings?.profileVisibility ?? ProfileVisibility.PUBLIC
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        shareBirthDate: settings.shareBirthDate,
        shareContactDetails: settings.shareContactDetails,
        shareSocialLinks: settings.shareSocialLinks,
        profileVisibility: settings.profileVisibility
      });
    }
  }, [settings, form]);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  console.log('settings', settings);

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    try {
      // Here you would typically save the data to your backend
      await updateSettings(data);
      showAlert({
        type: 'success',
        title: 'Settings Updated Successfully!',
        description: 'Your settings have been saved.'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      showAlert({
        type: 'error',
        title: 'Settings Update Failed',
        description: 'Please try again later.'
      });
    }
  };

  return (
    <>
      <AlertDialogUI />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <h6 className="text-paragraph-lg font-semibold">
                  Personal Information
                </h6>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name={option.id as keyof GeneralSettingsFormValues}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <FormLabel className="text-sm font-medium">
                        {option.label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h6 className="text-paragraph-lg font-semibold">
                  Profile Settings
                </h6>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Profile Visibility
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {visibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="h-10 w-fit gap-2 px-4">
              <SaveIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
