import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.services';

export class SettingsModule {
  controllers = [SettingsController];
  providers = [SettingsService];
}
