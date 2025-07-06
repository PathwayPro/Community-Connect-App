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
import {
  AdminMentorshipDashboardTotals,
  MenteeAdmin,
  MentorshipAdmin,
} from './entities/mentorship.entity';

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

      // Get total users (including deleted for total count)
      const totalUsers = await this.prisma.users.count();

      // Get active users (non-deleted users who logged in during the period)
      const activeUsers = await this.prisma.users.count({
        where: {
          deleted_at: false,
          last_login: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Get deleted users count
      const deletedUsers = await this.prisma.users.count({
        where: {
          deleted_at: true,
        },
      });

      // Get unverified users count (non-deleted email users with unverified email)
      const unverifiedUsers = await this.prisma.users.count({
        where: {
          deleted_at: false,
          provider: 'email',
          email_verified: false,
        },
      });

      // Get inactive users count (non-deleted users who haven't logged in during the period)
      const inactiveUsers = await this.prisma.users.count({
        where: {
          deleted_at: false,
          OR: [
            { last_login: null },
            {
              last_login: {
                lt: startDate,
              },
            },
          ],
        },
      });

      // Get new users created in current period (handle null created_at)
      const newUsersInPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          OR: [
            {
              created_at: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              created_at: null, // Treat null as recent/current period
            },
          ],
        },
      });

      // Get previous period for comparison
      const { startDate: prevStartDate, endDate: prevEndDate } =
        this.getPreviousPeriod(period);

      const activeUsersInPrevPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          last_login: {
            gte: prevStartDate,
            lte: prevEndDate,
          },
        },
      });

      const newUsersInPrevPeriod = await this.prisma.users.count({
        where: {
          deleted_at: false,
          created_at: {
            gte: prevStartDate,
            lte: prevEndDate,
          },
        },
      });

      // Calculate engagement rate (active users / total active users)
      const totalActiveUsers = totalUsers - deletedUsers;
      const engagementRate =
        totalActiveUsers === 0
          ? 0
          : Math.round((activeUsers / totalActiveUsers) * 100);

      // Calculate engagement rate change
      const prevEngagementRate =
        totalActiveUsers === 0
          ? 0
          : Math.round((activeUsersInPrevPeriod / totalActiveUsers) * 100);
      const engagementRateChange =
        prevEngagementRate === 0
          ? 0
          : Math.round(
              ((engagementRate - prevEngagementRate) / prevEngagementRate) *
                100,
            );

      // Calculate user growth rate based on actual new users
      const userGrowthRate =
        totalActiveUsers === 0
          ? 0
          : Math.round((newUsersInPeriod / totalActiveUsers) * 100);

      // Calculate user growth rate change
      const prevUserGrowthRate =
        totalActiveUsers === 0
          ? 0
          : Math.round((newUsersInPrevPeriod / totalActiveUsers) * 100);
      const userGrowthRateChange =
        prevUserGrowthRate === 0
          ? 0
          : Math.round(
              ((userGrowthRate - prevUserGrowthRate) / prevUserGrowthRate) *
                100,
            );

      // Convert all user metrics to percentages
      const totalUsersPercentage = 100; // Base reference
      const deletedUsersPercentage =
        totalUsers === 0 ? 0 : Math.round((deletedUsers / totalUsers) * 100);
      const activeUsersPercentage =
        totalUsers === 0 ? 0 : Math.round((activeUsers / totalUsers) * 100);
      const inactiveUsersPercentage =
        totalUsers === 0 ? 0 : Math.round((inactiveUsers / totalUsers) * 100);
      const unverifiedUsersPercentage =
        totalUsers === 0 ? 0 : Math.round((unverifiedUsers / totalUsers) * 100);

      return {
        totalUsers,
        deletedUsers,
        activeUsers,
        inactiveUsers,
        unverifiedUsers,
        totalUsersPercentage,
        deletedUsersPercentage,
        activeUsersPercentage,
        inactiveUsersPercentage,
        unverifiedUsersPercentage,
        userGrowthRate,
        userGrowthRateChange,
        engagementRate,
        engagementRateChange,
      };
    } catch (error) {
      console.error('Error in getOverviewMetrics:', error);
      throw new InternalServerErrorException(
        `Error getting overview metrics: ${error.message}`,
      );
    }
  }

  async getNewUsersData(period: AnalyticsPeriod) {
    try {
      // Since users table doesn't have created_at, we'll use ID as a proxy
      // Higher IDs generally mean more recent users (assuming auto-increment)
      const allUsers = await this.prisma.users.findMany({
        where: { deleted_at: false },
        select: { id: true },
        orderBy: { id: 'desc' },
      });

      // Get the ID range for the period (approximate)
      const totalUsers = allUsers.length;
      const usersInPeriod = Math.min(totalUsers, Math.floor(totalUsers * 0.1)); // Assume 10% are recent

      // Generate chart data based on period
      const chartData: Array<{ label: string; value: number }> = [];

      switch (period) {
        case AnalyticsPeriod.DAILY:
          // Mock hourly data for last 24 hours
          for (let i = 23; i >= 0; i--) {
            const hour = new Date();
            hour.setHours(hour.getHours() - i);
            chartData.push({
              label: `${hour.getHours()}:00`,
              value: Math.floor(Math.random() * 5),
            });
          }
          break;

        case AnalyticsPeriod.WEEKLY:
          // Last 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            chartData.push({
              label: date.toLocaleDateString('en-US', { weekday: 'short' }),
              value: Math.floor(Math.random() * 10),
            });
          }
          break;

        case AnalyticsPeriod.YEARLY:
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            chartData.push({
              label: date.toLocaleDateString('en-US', { month: 'short' }),
              value: Math.floor(Math.random() * 25),
            });
          }
          break;

        case AnalyticsPeriod.MONTHLY:
        default:
          // Last 30 days
          for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            chartData.push({
              label: date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
              }),
              value: Math.floor(Math.random() * 8),
            });
          }
          break;
      }

      return {
        currentValue: usersInPeriod,
        chartData,
      };
    } catch (error) {
      console.error('Error in getNewUsersData:', error);
      throw new InternalServerErrorException(
        `Error getting new users data: ${error.message}`,
      );
    }
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

      // Calculate percentages for the pie chart
      const activePercentage =
        totalUsers === 0 ? 0 : Math.round((activeUsers / totalUsers) * 100);
      const inactivePercentage = 100 - activePercentage;

      return {
        totalUsers,
        data: [
          {
            name: 'Active Users',
            value: activePercentage,
            color: '#364983',
          },
          {
            name: 'Inactive Users',
            value: inactivePercentage,
            color: '#AFB6CD',
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
          bio: true,
          role: true,
          dob: true,
          age_range: true,
          city: true,
          province: true,
          country_of_origin: true,
          work_status: true,
          company_name: true,
          linkedin_link: true,
          languages: true,
          experience: true,
          skills: true,
          last_login: true,
          picture_upload_link: true,
          actively_searching: true,
          profession: true,
          deleted_at: true,
          arrival_in_canada: true,
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
        arrivalInCanada: user.arrival_in_canada,
        skills: user.skills,
        languages: user.languages,
        experience: user.experience,
        bio: user.bio,
        city: user.city,
        province: user.province,
        countryOfOrigin: user.country_of_origin,
        workStatus: user.work_status,
        companyName: user.company_name,
        linkedinLink: user.linkedin_link,
        activelySearching: user.actively_searching,
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
      console.log(`adminId: ${adminId}`);
      throw new InternalServerErrorException(
        `Error resetting password: ${error.message}`,
      );
    }
  }

  async getAdminMentorshipTotals() {
    try {
      const totalMentors = await this.prisma.users.count({
        where: { deleted_at: false, role: 'MENTOR' },
      });
      const totalMentees = await this.prisma.users.count({
        where: { deleted_at: false, role: 'MENTEE' },
      });
      const mentorApplicationsLastMonth = await this.prisma.mentors.count({
        where: {
          created_at: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
            lte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });
      const menteeApplicationsLastMonth = await this.prisma.mentees.count({
        where: {
          created_at: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
            lte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });
      const mentorApplicationsCurrentMonth = await this.prisma.mentors.count({
        where: {
          created_at: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });
      const menteeApplicationsCurrentMonth = await this.prisma.mentees.count({
        where: {
          created_at: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      });

      const totals: AdminMentorshipDashboardTotals = {
        totalMentors,
        totalMentees,
        mentorApplicationsLastMonth,
        menteeApplicationsLastMonth,
        mentorApplicationsCurrentMonth,
        menteeApplicationsCurrentMonth,
      };

      return totals;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting admin mentorship totals: ${error.message}`,
      );
    }
  }

  async getAdminMentorApplications(): Promise<MentorshipAdmin[]> {
    try {
      const mentorApplications = await this.prisma.mentors.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          resume: true, // Add this line
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              picture_upload_link: true,
              email: true,
            },
          },
          availability: true,
          max_mentees: true,
          profession: true,
          experience_years: true,
          experience_details: true,
          created_at: true,
          status: true,
        },
      });

      const mappedMentorApplications: MentorshipAdmin[] =
        mentorApplications.map((mentor) => ({
          id: mentor.user.id,
          identity: {
            avatar: mentor.user.picture_upload_link,
            firstName: mentor.user.first_name,
            lastName: mentor.user.last_name,
          },
          experience: mentor.experience_years + ' years',
          experienceDescription: mentor.experience_details,
          profession: mentor.profession,
          email: mentor.user.email,
          status: mentor.status,
          capacity: mentor.max_mentees,
          availability: mentor.availability,
          resume: mentor.resume, // Add this line
        }));

      return mappedMentorApplications;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting mentor applications: ${error.message}`,
      );
    }
  }
  async getAdminMenteeApplications(): Promise<MenteeAdmin[]> {
    try {
      const menteeApplications = await this.prisma.mentees.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              picture_upload_link: true,
              email: true,
              profession: true,
              experience: true,
            },
          },
          reason: true,
          created_at: true,
          status: true,
        },
      });

      const mappedMenteeApplications: MenteeAdmin[] = menteeApplications.map(
        (mentee) => ({
          id: mentee.user.id,
          identity: {
            avatar: mentee.user.picture_upload_link,
            firstName: mentee.user.first_name,
            lastName: mentee.user.last_name,
          },
          date: mentee.created_at.toISOString(),
          reason: mentee.reason,
          profession: mentee.user.profession,
          email: mentee.user.email,
          status: mentee.status,
          experience: mentee.user.experience,
        }),
      );

      return mappedMenteeApplications;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting mentee applications: ${error.message}`,
      );
    }
  }
}
