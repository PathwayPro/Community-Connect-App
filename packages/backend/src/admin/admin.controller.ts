import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles, GetUser } from 'src/auth/decorators';
import { AdminService } from './admin.service';
import { AnalyticsQueryDto } from './dto/analytics.dto';
import {
  GetUsersQueryDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  ResetUserPasswordDto,
} from './dto/user-management.dto';
import {
  OverviewMetrics,
  NewUsersData,
  UserDistribution,
  UserActivityMetrics,
} from './entities/analytics.entity';
import {
  PaginatedUsers,
  UserManagementItem,
} from './entities/user-management.entity';
import {
  AdminMentorshipDashboardTotals,
  MentorshipAdmin,
} from './entities/mentorship.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Analytics Endpoints
  @Roles('ADMIN')
  @Get('analytics/overview')
  @ApiOkResponse({ type: OverviewMetrics })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get overview metrics',
    description:
      'Get overview metrics including total users and engagement rate',
  })
  getOverviewMetrics(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getOverviewMetrics(query.period);
  }

  @Roles('ADMIN')
  @Get('analytics/new-users')
  @ApiOkResponse({ type: NewUsersData })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get new users data',
    description: 'Get data about new user registrations over time',
  })
  getNewUsersData(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getNewUsersData(query.period);
  }

  @Roles('ADMIN')
  @Get('analytics/user-distribution')
  @ApiOkResponse({ type: UserDistribution })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get user distribution',
    description: 'Get distribution of users by active status',
  })
  getUserDistribution(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getUserDistribution(query.period);
  }

  @Roles('ADMIN')
  @Get('analytics/user-activity')
  @ApiOkResponse({ type: [UserActivityMetrics] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get user activity data',
    description: 'Get data about user activity across different features',
  })
  getUserActivityData(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getUserActivityData(query.period);
  }

  // User Management Endpoints
  @Roles('ADMIN')
  @Get('users')
  @ApiOkResponse({ type: PaginatedUsers })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users with pagination and filtering options',
  })
  getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getAllUsers(query);
  }

  @Roles('ADMIN')
  @Get('users/:id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserManagementItem })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get detailed information about a specific user',
  })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Roles('ADMIN')
  @Put('users/:id/role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserManagementItem })
  @ApiBadRequestResponse({ description: 'User not found or invalid role' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Update user role',
    description: 'Update the role of a specific user',
  })
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @GetUser('sub') adminId: number,
  ) {
    return this.adminService.updateUserRole(
      id,
      updateUserRoleDto.role,
      adminId,
    );
  }

  @Roles('ADMIN')
  @Put('users/:id/status')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserManagementItem })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Update user status',
    description: 'Activate or deactivate a specific user',
  })
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @GetUser('sub') adminId: number,
  ) {
    return this.adminService.updateUserStatus(
      id,
      updateUserStatusDto.isActive,
      adminId,
    );
  }

  @Roles('ADMIN')
  @Post('users/:id/reset-password')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'Password reset successful' })
  @ApiBadRequestResponse({ description: 'User not found or invalid password' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Reset the password of a specific user',
  })
  resetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() resetUserPasswordDto: ResetUserPasswordDto,
    @GetUser('sub') adminId: number,
  ) {
    return this.adminService.resetUserPassword(
      id,
      resetUserPasswordDto.password,
      adminId,
    );
  }

  @Roles('ADMIN')
  @Get('mentorship/total-applications')
  @ApiOkResponse({ type: AdminMentorshipDashboardTotals })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Total mentors, mentees, and applications',
    description:
      'Get totals for current mentors and mentees, and applications from the last month and current month',
  })
  @ApiBearerAuth('JWT')
  async getAdminMentorshipTotals() {
    return await this.adminService.getAdminMentorshipTotals();
  }

  @Roles('ADMIN')
  @Get('mentorship/mentor-applications')
  @ApiOkResponse({ type: [MentorshipAdmin] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary: 'Mentor applications',
    description: 'List of all the applications to become a mentor',
  })
  @ApiBearerAuth('JWT')
  async getAdminMentorApplications() {
    return await this.adminService.getAdminMentorApplications();
  }
}
