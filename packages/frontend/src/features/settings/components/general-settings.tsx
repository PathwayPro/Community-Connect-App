'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/shared/components/ui/label';
import { useSettingsStore } from '../store';

interface PrivacyOption {
  id: string;
  label: string;
  description?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

interface VisibilitySection {
  id: string;
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface GeneralSettingsProps {
  onHasChanges: (hasChanges: boolean) => void;
  onSave: () => void;
}

export default function GeneralSettings({
  onHasChanges,
  onSave
}: GeneralSettingsProps) {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState({
    shareBirthDate: settings?.shareBirthDate || false,
    shareContactDetails: settings?.shareContactDetails || false,
    shareSocialLinks: settings?.shareSocialLinks || false,
    profileVisibility: settings?.profileVisibility || 'public',
    messageSettings: settings?.messageSettings || 'everyone'
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when store settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        shareBirthDate: settings.shareBirthDate || false,
        shareContactDetails: settings.shareContactDetails || false,
        shareSocialLinks: settings.shareSocialLinks || false,
        profileVisibility: settings.profileVisibility || 'public',
        messageSettings: settings.messageSettings || 'everyone'
      });
    }
  }, [settings]);

  // Notify parent component about changes
  useEffect(() => {
    onHasChanges(hasChanges);
  }, [hasChanges, onHasChanges]);

  // Expose save function to parent
  useEffect(() => {
    // Create and pass the save handler to parent
    const saveHandler = () => {
      if (settings?.id) {
        updateSettings(settings.id, localSettings);
        setHasChanges(false);
        console.log('Settings updated:', localSettings);
      }
    };

    // Store the handler in a ref or context that the parent can access
    onSave = saveHandler;
  }, [localSettings, settings, updateSettings]);

  const updateLocalSettings = (updates: Partial<typeof localSettings>) => {
    setLocalSettings((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const privacyOptions: PrivacyOption[] = [
    {
      id: 'birthDate',
      label: 'Share Birth Date',
      value: localSettings.shareBirthDate,
      onToggle: (value) => {
        updateLocalSettings({ shareBirthDate: value });
        console.log('Birth date visibility:', value);
      }
    },
    {
      id: 'contactDetails',
      label: 'Share Contact Details',
      value: localSettings.shareContactDetails,
      onToggle: (value) => {
        updateLocalSettings({ shareContactDetails: value });
        console.log('Contact details visibility:', value);
      }
    },
    {
      id: 'socialLinks',
      label: 'Share Social Links',
      value: localSettings.shareSocialLinks,
      onToggle: (value) => {
        updateLocalSettings({ shareSocialLinks: value });
        console.log('Social links visibility:', value);
      }
    }
  ];

  const visibilitySections: VisibilitySection[] = [
    {
      id: 'profileVisibility',
      label: 'Profile Visibility',
      description: 'Manage who can view your profile information.',
      value: localSettings.profileVisibility,
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'connections', label: 'Connections Only' }
      ],
      onChange: (value) => {
        updateLocalSettings({
          profileVisibility: value as 'public' | 'private' | 'connections'
        });
        console.log('Profile visibility:', value);
      }
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'Manage who is allowed to message you.',
      value: localSettings.messageSettings,
      options: [
        { value: 'everyone', label: 'Everyone' },
        { value: 'connections', label: 'Only Connections' }
      ],
      onChange: (value) => {
        updateLocalSettings({
          messageSettings: value as 'everyone' | 'connections'
        });
        console.log('Messages settings:', value);
      }
    }
  ];

  return (
    <div className="space-y-6">
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
            <div
              key={option.id}
              className="flex items-center justify-between space-y-2"
            >
              <Label htmlFor={option.id} className="text-sm font-medium">
                {option.label}
              </Label>
              <Switch
                id={option.id}
                checked={option.value}
                onCheckedChange={option.onToggle}
              />
            </div>
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
          {visibilitySections.map((section) => (
            <div key={section.id} className="space-y-2">
              <Label htmlFor={section.id} className="text-sm font-medium">
                {section.label}
              </Label>
              {section.description && (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
              <Select value={section.value} onValueChange={section.onChange}>
                <SelectTrigger id={section.id} className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {section.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
