import { Controller, Get, Body, UseGuards, Post, Put } from '@nestjs/common';
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
import { CreateSettingsDto } from './dto/create-settings.dto';

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
  @Put('update')
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

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post()
  @ApiOkResponse({ description: 'Successfully created user settings' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create settings' })
  @ApiOperation({ summary: 'Create user settings' })
  async createSettings(@GetUser() user: JwtPayload) {
    return await this.settingsService.createUserSettings(user.sub);
  }

  @Roles('ADMIN')
  @Post('create-existing')
  @ApiOkResponse({ description: 'Successfully created existing user settings' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create settings' })
  @ApiOperation({ summary: 'Create existing user settings' })
  async createExistingSettings(@Body() createSettingsDto: CreateSettingsDto) {
    return await this.settingsService.createSettingsForExistingUsers(
      createSettingsDto,
    );
  }
}
