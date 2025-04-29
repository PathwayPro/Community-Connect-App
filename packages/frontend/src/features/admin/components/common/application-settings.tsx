import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';

export const ApplicationSettings = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [userRegistration, setUserRegistration] = useState(true);
  const [theme, setTheme] = useState('system');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Application Settings</h2>
        <p className="text-muted-foreground">
          Configure global application settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage basic application configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="My Application" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-url">Application URL</Label>
              <Input id="app-url" defaultValue="https://myapp.example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-theme">Default Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="app-theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Registration</CardTitle>
            <CardDescription>
              Configure user registration settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user-registration">
                  Allow User Registration
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable new user registration.
                </p>
              </div>
              <Switch
                id="user-registration"
                checked={userRegistration}
                onCheckedChange={setUserRegistration}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-role">Default User Role</Label>
              <Select defaultValue="user">
                <SelectTrigger id="default-role">
                  <SelectValue placeholder="Select default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-email">Welcome Email Template</Label>
              <Textarea
                id="welcome-email"
                placeholder="Enter welcome email content..."
                defaultValue="Welcome to our application! We're excited to have you join us."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security related settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="60"
                min="5"
                max="1440"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                defaultValue="5"
                min="1"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select defaultValue="strong">
                <SelectTrigger id="password-policy">
                  <SelectValue placeholder="Select password policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="medium">
                    Medium (8+ chars, numbers)
                  </SelectItem>
                  <SelectItem value="strong">
                    Strong (8+ chars, numbers, symbols)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
            <CardDescription>
              Control application maintenance status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode">
                  Enable Maintenance Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Put the application in maintenance mode.
                </p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={isMaintenanceMode}
                onCheckedChange={setIsMaintenanceMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                placeholder="Enter maintenance message..."
                defaultValue="We're currently performing scheduled maintenance. Please check back shortly."
                rows={4}
                disabled={!isMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};
