import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { ProfileVisibility, UserSettings } from '@prisma/client';
@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSettings(userId: number) {
    try {
      const settings = await this.prisma.userSettings.findUnique({
        where: { userId },
      });
      if (!settings) {
        throw new NotFoundException(
          `Settings not found for user ID #${userId}`,
        );
      }

      return settings;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve settings: ${error.message}`,
      );
    }
  }

  async updateUserSettings(
    userId: number,
    updateSettingsDto: UpdateSettingsDto,
  ) {
    try {
      // First check if settings exist
      const existingSettings = await this.prisma.userSettings.findUnique({
        where: { userId },
      });

      // If settings don't exist, create them first
      if (!existingSettings) {
        await this.createUserSettings(userId);
      }

      // Now update the settings
      const updatedSettings = await this.prisma.userSettings.update({
        where: { userId },
        data: updateSettingsDto,
      });

      return updatedSettings;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update settings: ${error.message}`,
      );
    }
  }

  async createUserSettings(userId: number) {
    try {
      const newSettings = await this.prisma.userSettings.create({
        data: {
          userId,
          profileVisibility: ProfileVisibility.PUBLIC,
          shareBirthDate: true,
          shareContactDetails: false,
          shareSocialLinks: true,
        },
      });

      return newSettings;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create settings: ${error.message}`,
      );
    }
  }

  async createSettingsForExistingUsers(createSettingsDto: CreateSettingsDto) {
    const updatedSettings: UserSettings[] = [];

    try {
      const users = await this.prisma.users.findMany({});

      for (const user of users) {
        const existingSettings = await this.prisma.userSettings.findUnique({
          where: { userId: user.id },
        });

        if (!existingSettings) {
          const updatedSetting = await this.prisma.userSettings.create({
            data: {
              userId: user.id,
              ...createSettingsDto,
            },
          });

          updatedSettings.push(updatedSetting);
        }
      }

      return updatedSettings;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update settings: ${error.message}`,
      );
    }
  }
}
