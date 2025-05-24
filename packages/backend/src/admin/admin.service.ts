import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database';
import { users_roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AnalyticsPeriod } from './dto/analytics.dto';
import { GetUsersQueryDto } from './dto/user-management.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Helper methods for date calculations
  private getDateRange(period: AnalyticsPeriod): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case AnalyticsPeriod.DAILY:
        startDate.setDate(startDate.getDate() - 1);
        break;
      case AnalyticsPeriod.WEEKLY:
        startDate.setDate(startDate.getDate() - 7);
        break;
      case AnalyticsPeriod.YEARLY:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case AnalyticsPeriod.MONTHLY:
      default:
        startDate.setMonth(startDate.getMonth() - 6);
        break;
    }

    return { startDate, endDate };
  }

  private getPreviousPeriod(period: AnalyticsPeriod): {
    startDate: Date;
    endDate: Date;
  } {
    const { startDate, endDate } = this.getDateRange(period);
    const duration = endDate.getTime() - startDate.getTime();

    const prevEndDate = new Date(startDate);
    const prevStartDate = new Date(prevEndDate.getTime() - duration);

    return { startDate: prevStartDate, endDate: prevEndDate };
  }

  // Analytics methods
  async getOverviewMetrics(period: AnalyticsPeriod) {
    try {
      const { startDate, endDate } = this.getDateRange(period);
      const { startDate: prevStartDate, endDate: prevEndDate } =
        this.getPreviousPeriod(period);

      // Get total users
      const totalUsers = await this.prisma.users.count({
        where: { deleted_at: false },
      });

      // Get users in current period
      const usersInPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          // created_at: {
          //   gte: startDate,
          //   lte: endDate,
          // },
        },
      });

      // Get users in previous period
      const usersInPrevPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          // created_at: {
          //   gte: prevStartDate,
          //   lte: prevEndDate,
          // },
        },
      });

      // Calculate user growth rate
      const userGrowthRate =
        usersInPrevPeriod === 0
          ? 100
          : Math.round(
              ((usersInPeriod - usersInPrevPeriod) / usersInPrevPeriod) * 100,
            );

      // Get active users (users who logged in during the period)
      const activeUsers = await this.prisma.users.count({
        where: {
          deleted_at: false,
          last_login: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Get active users in previous period
      const activeUsersInPrevPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          last_login: {
            gte: prevStartDate,
            lte: prevEndDate,
          },
        },
      });

      // Calculate engagement rate
      const engagementRate = Math.round((activeUsers / totalUsers) * 100);

      // Calculate engagement rate change
      const prevEngagementRate =
        totalUsers === 0
          ? 0
          : Math.round((activeUsersInPrevPeriod / totalUsers) * 100);
      const engagementRateChange =
        prevEngagementRate === 0
          ? 0
          : Math.round(
              ((engagementRate - prevEngagementRate) / prevEngagementRate) *
                100,
            );

      return {
        totalUsers,
        userGrowthRate,
        engagementRate,
        engagementRateChange,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting overview metrics: ${error.message}`,
      );
    }
  }

  async getNewUsersData(period: AnalyticsPeriod) {
    try {
      const { startDate, endDate } = this.getDateRange(period);
      let format: string;
      let interval: string;

      // Determine grouping format based on period
      switch (period) {
        case AnalyticsPeriod.DAILY:
          format = '%Y-%m-%d %H:00';
          interval = 'hour';
          break;
        case AnalyticsPeriod.WEEKLY:
          format = '%Y-%m-%d';
          interval = 'day';
          break;
        case AnalyticsPeriod.YEARLY:
          format = '%Y-%m';
          interval = 'month';
          break;
        case AnalyticsPeriod.MONTHLY:
        default:
          format = '%Y-%m-%d';
          interval = 'day';
          break;
      }

      // Generate date series for the period
      const dateLabels = this.generateDateSeries(startDate, endDate, interval);

      // Query for new users by time interval
      const newUsersQuery = await this.prisma.$queryRaw<
        Array<{ label: string; value: string }>
      >`
        SELECT 
          TO_CHAR(created_at, ${format}) as label,
          COUNT(*) as value
        FROM users
        WHERE 
          created_at >= ${startDate} AND
          created_at <= ${endDate} AND
          deleted_at = false
        GROUP BY label
        ORDER BY label ASC
      `;

      // Convert query results to a map for easy lookup
      const dataMap = new Map();
      newUsersQuery.forEach((item) => {
        dataMap.set(item.label, parseInt(item.value));
      });

      // Create final dataset with all intervals, filling gaps with zeros
      const chartData = dateLabels.map((label) => ({
        label,
        value: dataMap.has(label) ? dataMap.get(label) : 0,
      }));

      // Get total new users in the period
      const currentValue = await this.prisma.users.count({
        where: {
          deleted_at: false,
          // created_at: {
          //   gte: startDate,
          //   lte: endDate,
          // },
        },
      });

      return {
        currentValue,
        chartData,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting new users data: ${error.message}`,
      );
    }
  }

  private generateDateSeries(
    startDate: Date,
    endDate: Date,
    interval: string,
  ): string[] {
    const result = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      switch (interval) {
        case 'hour':
          result.push(
            current.toISOString().substring(0, 13).replace('T', ' ') + ':00',
          );
          current.setHours(current.getHours() + 1);
          break;
        case 'day':
          result.push(current.toISOString().substring(0, 10));
          current.setDate(current.getDate() + 1);
          break;
        case 'month':
          result.push(current.toISOString().substring(0, 7));
          current.setMonth(current.getMonth() + 1);
          break;
        default:
          current.setDate(current.getDate() + 1);
      }
    }

    return result;
  }

  async getUserDistribution(period: AnalyticsPeriod) {
    try {
      const { startDate, endDate } = this.getDateRange(period);

      // Count total users
      const totalUsers = await this.prisma.users.count({
        where: { deleted_at: false },
      });

      // Count active users (users who logged in during the period)
      const activeUsers = await this.prisma.users.count({
        where: {
          deleted_at: false,
          last_login: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Calculate inactive users
      const inactiveUsers = totalUsers - activeUsers;

      return {
        totalUsers,
        data: [
          {
            name: 'Active Users',
            value: activeUsers,
            color: '#364983', // Using color from the screenshot
          },
          {
            name: 'Inactive Users',
            value: inactiveUsers,
            color: '#AFB6CD', // Using color from the screenshot
          },
        ],
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting user distribution: ${error.message}`,
      );
    }
  }

  async getUserActivityData(period: AnalyticsPeriod) {
    try {
      const { startDate, endDate } = this.getDateRange(period);

      // Get counts of different types of activities
      const networkingCount = await this.prisma.messages.count({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const featuresCount = await this.prisma.posts.count({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const resourcesCount = await this.prisma.resources.count({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const eventsCount = await this.prisma.eventsSubscriptions.count({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return [
        { type: 'Networking', count: networkingCount },
        { type: 'Features', count: featuresCount },
        { type: 'Resources', count: resourcesCount },
        { type: 'Events', count: eventsCount },
      ];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting user activity data: ${error.message}`,
      );
    }
  }

  // User Management methods
  async getAllUsers(query: GetUsersQueryDto) {
    try {
      const { page = 1, limit = 10, search, role, isActive } = query;
      const skip = (page - 1) * limit;

      // Build where clause based on filters
      const where: any = {};

      if (search) {
        where.OR = [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        // Assuming a user is active if they have logged in within the last 30 days
        if (isActive) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          where.last_login = { gte: thirtyDaysAgo };
        } else {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          where.OR = [
            { last_login: null },
            { last_login: { lt: thirtyDaysAgo } },
          ];
        }
      }

      // Count total users matching filters
      const total = await this.prisma.users.count({ where });

      // Get paginated users
      const users = await this.prisma.users.findMany({
        where,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          last_login: true,
          picture_upload_link: true,
          profession: true,
          deleted_at: true,
        },
        skip,
        take: limit,
        orderBy: { first_name: 'asc' },
      });

      // Map users to desired format
      const mappedUsers = users.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: this.determineUserStatus(user),
        pictureUploadLink: user.picture_upload_link,
        profession: user.profession,
        lastLogin: user.last_login ? user.last_login.toISOString() : null,
      }));

      return {
        users: mappedUsers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting users: ${error.message}`,
      );
    }
  }

  private determineUserStatus(
    user: any,
  ): 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED' {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    // First check if user is deleted
    if (user.deleted_at === true) {
      return 'DELETED';
    }

    // Then check email verification status
    if (user.email_verified === false) {
      return 'PENDING';
    }

    // For active status check, we need to handle both null and valid last_login
    const lastLoginTime = user.last_login
      ? new Date(user.last_login).getTime()
      : null;
    const isInactive = lastLoginTime
      ? Date.now() - lastLoginTime > ONE_WEEK_MS
      : true;

    // Google users and email verified users follow the same active/inactive logic
    return isInactive ? 'INACTIVE' : 'ACTIVE';
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          last_login: true,
          picture_upload_link: true,
          profession: true,
          deleted_at: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: this.determineUserStatus(user),
        pictureUploadLink: user.picture_upload_link,
        profession: user.profession,
        lastLogin: user.last_login ? user.last_login.toISOString() : null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error getting user: ${error.message}`,
      );
    }
  }

  async updateUserRole(id: number, role: users_roles, adminId: number) {
    try {
      // Check if trying to update own role
      if (id === adminId) {
        throw new BadRequestException('Cannot change your own role');
      }

      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update user role
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          last_login: true,
          picture_upload_link: true,
          profession: true,
          deleted_at: true,
        },
      });

      return {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: this.determineUserStatus(updatedUser),
        pictureUploadLink: updatedUser.picture_upload_link,
        profession: updatedUser.profession,
        lastLogin: updatedUser.last_login
          ? updatedUser.last_login.toISOString()
          : null,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Error updating user role: ${error.message}`,
      );
    }
  }

  async updateUserStatus(id: number, isActive: boolean, adminId: number) {
    try {
      // Check if trying to update own status
      if (id === adminId) {
        throw new BadRequestException('Cannot change your own status');
      }

      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update user status (soft delete or restore)
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { deleted_at: !isActive },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          last_login: true,
          picture_upload_link: true,
          profession: true,
          deleted_at: true,
        },
      });

      return {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: this.determineUserStatus(updatedUser),
        pictureUploadLink: updatedUser.picture_upload_link,
        profession: updatedUser.profession,
        lastLogin: updatedUser.last_login
          ? updatedUser.last_login.toISOString()
          : null,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Error updating user status: ${error.message}`,
      );
    }
  }

  async resetUserPassword(id: number, password: string, adminId: number) {
    try {
      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Hash the new password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password
      await this.prisma.users.update({
        where: { id },
        data: { password_hash: hashedPassword },
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error resetting password: ${error.message}`,
      );
    }
  }
}
