import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.services';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetUser, Roles } from 'src/auth/decorators';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@ApiTags('Settings')
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Get()
  @ApiOkResponse({ description: 'Successfully retrieved user settings' })
  @ApiNotFoundResponse({ description: 'Settings not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve settings',
  })
  @ApiOperation({ summary: 'Get user settings' })
  async getSettings(@GetUser() user: JwtPayload) {
    return await this.settingsService.getUserSettings(user.sub);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Patch()
  @ApiOkResponse({ description: 'Successfully updated user settings' })
  @ApiInternalServerErrorResponse({ description: 'Failed to update settings' })
  @ApiOperation({ summary: 'Update user settings' })
  async updateSettings(
    @GetUser() user: JwtPayload,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return await this.settingsService.updateUserSettings(
      user.sub,
      updateSettingsDto,
    );
  }
}
