import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database';
import { UpdateSettingsDto } from './dto/update-settings.dto';

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
}
