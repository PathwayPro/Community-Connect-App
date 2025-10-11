import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { PrismaService } from 'src/database';
import { FilterMentorDto } from './dto/filter-mentor.dto';
import { Prisma, users_roles, mentors_status } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';

@Injectable()
export class MentorService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  // ------------------------------
  // MENTOR APPLICATIONS
  // ------------------------------

  private async addUserInterestsFormatted(
    user_id: number,
    interests: string | number[],
  ) {
    try {
      console.log(
        '| - - - - - - - > ADD USER INTERESTS FORMATTED < - - - - - - - |',
      );
      console.log('| - - - - - - - > INTERESTS:', interests);
      // TRANSFORM STRING OF INTEREST INTO ARRAY
      // const interestsToArray = typeof interests === 'string' ? JSON.parse(interests) : interests;
      // const interestsToArray = typeof interests === 'string' ? JSON.parse(interests).map((item: any) => parseInt(item, 10)) : interests.map((item: any) => parseInt(item, 10));

      // Handle interests[] format
      const interestsToArray = Array.isArray(interests)
        ? interests.map((item: any) => parseInt(item, 10))
        : typeof interests === 'string'
          ? interests.split(',').map((item: any) => parseInt(item, 10))
          : typeof interests === 'number'
            ? [parseInt(String(interests), 10)]
            : [];

      console.log('| - - - - - - - > INTERESTS TO ARRAY:', interestsToArray);

      // VALIDATE ONLY THE EXISTING ONES AND RETURN FORMATTED VALUES
      const validInterestsIds = await this.prisma.interests
        .findMany({
          where: { id: { in: interestsToArray } },
          select: { id: true },
        })
        .then((interests) =>
          interests.map((interest) => ({
            user_id: user_id,
            interest_id: interest.id,
          })),
        );

      // REMOVE PREVOIUS INTEREST FOR THE USER
      await this.prisma.usersInterests.deleteMany({
        where: { user_id: user_id },
      });

      // ADD VALIDATED INTERESTS TO THE USER
      const userInterests = await this.prisma.usersInterests.createMany({
        data: validInterestsIds,
        skipDuplicates: true,
      });

      if (!userInterests || userInterests.count < 1) {
        throw new InternalServerErrorException(
          'There was an error saving your interests. Please try again later or edit your application.',
        );
      }

      return validInterestsIds;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving interests: ' + error.message,
      );
    }
  }

  async findAll(filters: FilterMentorDto = null) {
    // filters:
    //    max_mentees > X,
    //    has_experience: true | false
    //    status: PRiSMA ENUM mentors_status
    const appliedFilters: Prisma.mentorsWhereInput = {};

    if (filters?.max_mentees) {
      appliedFilters.max_mentees = {
        gte: filters.max_mentees,
      };
    }

    if (filters?.has_experience !== undefined) {
      //appliedFilters.has_experience = filters.has_experience;
    }

    if (filters?.status) {
      appliedFilters.status = filters.status;
    }

    try {
      const mentors = await this.prisma.mentors.findMany({
        where: appliedFilters,
        include: {
          user: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
              interests: {
                select: {
                  interest: true,
                },
              },
            },
          },
        },
      });
      return mentors;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneById(id: number) {
    try {
      const mentor = await this.prisma.mentors.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
              interests: {
                select: {
                  interest: true,
                },
              },
            },
          },
        },
      });

      if (!mentor) {
        throw new NotFoundException(
          `There is no mentor application with ID: ${id}. Make sure you are not using a user ID`,
        );
      }

      return mentor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findOneByUserId(
    user_id: number,
    status: mentors_status = null,
    raiseError: boolean = true,
  ) {
    try {
      const mentor = await this.prisma.mentors.findFirst({
        where: { user_id, status },
        include: {
          user: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
              interests: {
                select: {
                  interest: true,
                },
              },
            },
          },
        },
      });

      if (!mentor && raiseError) {
        throw new NotFoundException(
          `There is no mentor application for this user (USER ID: ${user_id}).`,
        );
      }

      return mentor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async create(
    user_id: number,
    createMentorDto: CreateMentorDto,
    file: Express.Multer.File,
  ) {
    console.log('| - - - - - - - > SERVICE CREATE MENTOR < - - - - - - - |');
    console.log('| - - - - - - - > USER ID:', user_id);
    console.log('| - - - - - - - > CREATE MENTOR DTO:', createMentorDto);
    console.log('| - - - - - - - > FILE:', file);

    try {
      // UPLOAD RESUME TO GET THE LINK
      const resumeLink = await this.filesService.upload(
        FileValidationEnum.RESUME,
        file,
      );
      if (!resumeLink) {
        throw new InternalServerErrorException(
          'There was a problem uploading your resume. Please try again later',
        );
      }

      // FIXED DATA FOR CREATIONS
      const mentorData = {
        profession: createMentorDto.profession,
        experience_years: createMentorDto.experience_years,
        experience_details: createMentorDto.experience_details,
        max_mentees: createMentorDto.max_mentees,
        availability: createMentorDto.availability,
        user: { connect: { id: user_id } },
        resume: resumeLink.path + '/' + resumeLink.fileName,
        status: mentors_status.PENDING,
      };

      // CREATE THE MENTOR APPLICATION
      const mentor = await this.prisma.mentors.create({
        data: mentorData,
        include: {
          user: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
            },
          },
        },
      });
      if (!mentor) {
        throw new InternalServerErrorException(
          'There was a problema creating your mentorship application. Please try again later.',
        );
      }

      // INTERESTS
      const mentorInterests = !createMentorDto.interests
        ? []
        : await this.addUserInterestsFormatted(
            user_id,
            createMentorDto.interests,
          );

      return { ...mentor, interests: mentorInterests };
    } catch (error) {
      console.log('| - - - - - - - > ERROR:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('Mentor already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('The associated user does not exists');
      }
      throw new BadRequestException('Error creating mentor: ' + error.message);
    }
  }

  async update(user_id: number, updateMentor: UpdateMentorDto) {
    try {
      // Validate mentor existence
      const mentorToUpdate = await this.findOneByUserId(user_id);

      // Update interests first to get them directly when updating mentor application
      if (updateMentor.interests) {
        const updatedInterests = await this.addUserInterestsFormatted(
          user_id,
          updateMentor.interests,
        );
        if (!updatedInterests) {
          throw new InternalServerErrorException(
            'There was an error updating your interests. Please try again later.',
          );
        }
      }

      // Update mentor application and select data to return
      if (mentorToUpdate) {
        // Update mentor information
        const dataToUpdate: Prisma.mentorsUncheckedUpdateInput = {
          profession: updateMentor.profession,
          experience_years: updateMentor.experience_years,
          max_mentees: updateMentor.max_mentees,
          availability: updateMentor.availability,
          experience_details: updateMentor.experience_details,
        };
        const updatedMentor = await this.prisma.mentors.update({
          where: { id: mentorToUpdate.id },
          data: dataToUpdate,
          select: {
            max_mentees: true,
            availability: true,
            experience_details: true,
            experience_years: true,
            status: true,
            profession: true,
            resume: true,
            user: {
              select: {
                first_name: true,
                middle_name: true,
                last_name: true,
                interests: {
                  select: {
                    interest: true,
                  },
                },
              },
            },
          },
        });

        return updatedMentor;
      } else {
        throw new NotFoundException(
          `Mentor application user with ID: ${user_id} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Error updating mentor: ' + error.message);
    }
  }

  async updateStatus(
    mentorApplicationId: number,
    updateMentor: UpdateMentorDto,
  ) {
    try {
      // Validate mentor existence
      const mentorToUpdate = await this.findOneById(mentorApplicationId);

      if (mentorToUpdate) {
        // Update mentor status
        const updatedMentor = await this.prisma.mentors.update({
          where: { id: mentorApplicationId },
          data: updateMentor,
        });

        // Update user role according to status
        if (updatedMentor) {
          const userId = updatedMentor.user_id;
          const userRole: users_roles =
            updatedMentor.status === 'APPROVED' ? 'MENTOR' : 'USER';

          const updatedUser = await this.prisma.users.update({
            where: { id: userId },
            data: { role: userRole },
            select: {
              id: true,
              first_name: true,
              last_name: true,
              middle_name: true,
              mentor: true,
              interests: {
                select: {
                  interest: true,
                },
              },
            },
          });

          return updatedUser;
        } else {
          throw new InternalServerErrorException(
            `There was an error updating the mentor application with ID: ${mentorApplicationId}`,
          );
        }
      } else {
        throw new NotFoundException(
          `Mentor application with ID: ${mentorApplicationId} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating mentor application status: ' + error.message,
      );
    }
  }

  remove(id: number) {
    // TO-DO: REMOVE MENTOR INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?
    return `This action removes a #${id} mentor`;
  }

  // ------------------------------
  // MENTOR DASHBOARD
  // ------------------------------

  async getMyDashboard(mentorId: number) {
    try {
      // Get statistics
      const statistics = await this.getMyStatistics(mentorId);

      // Get upcoming sessions
      const upcomingSessions = await this.getMyUpcomingSessions(mentorId);

      // Get mentees
      const mentees = await this.getMyMentees(mentorId);

      return { statistics, upcomingSessions, mentees };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error getting mentor dashboard: ${error.message}`,
      );
    }
  }

  async getMyStatistics(mentorId: number) {
    try {
      // Get current month and previous month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get all sessions for this mentor
      const allSessions = await this.prisma.mentorshipSessions.findMany({
        where: {
          mentorId: mentorId,
        },
        select: {
          dateStart: true,
          dateEnd: true,
          createdAt: true,
        },
      });

      // Calculate total minutes mentored
      let totalMinutesMentored = 0;
      allSessions.forEach((session) => {
        const duration =
          new Date(session.dateEnd).getTime() -
          new Date(session.dateStart).getTime();
        totalMinutesMentored += Math.floor(duration / (1000 * 60)); // Convert to minutes
      });

      // Calculate current month minutes
      const currentMonthSessions = allSessions.filter(
        (session) => new Date(session.createdAt) >= currentMonthStart,
      );
      let currentMonthMinutes = 0;
      currentMonthSessions.forEach((session) => {
        const duration =
          new Date(session.dateEnd).getTime() -
          new Date(session.dateStart).getTime();
        currentMonthMinutes += Math.floor(duration / (1000 * 60));
      });

      // Calculate previous month minutes
      const previousMonthSessions = allSessions.filter(
        (session) =>
          new Date(session.createdAt) >= previousMonthStart &&
          new Date(session.createdAt) <= previousMonthEnd,
      );
      let previousMonthMinutes = 0;
      previousMonthSessions.forEach((session) => {
        const duration =
          new Date(session.dateEnd).getTime() -
          new Date(session.dateStart).getTime();
        previousMonthMinutes += Math.floor(duration / (1000 * 60));
      });

      // Calculate minutes difference percentage
      const minutesDiff =
        previousMonthMinutes > 0
          ? ((currentMonthMinutes - previousMonthMinutes) /
              previousMonthMinutes) *
            100
          : 0;

      // Get mentees count
      const menteesCount = await this.prisma.matchedMentorMentee.count({
        where: {
          mentorId: mentorId,
          status: 'APPROVED',
        },
      });

      // Get previous month mentees count
      const previousMonthMentees = await this.prisma.matchedMentorMentee.count({
        where: {
          mentorId: mentorId,
          status: 'APPROVED',
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      });

      // Calculate mentees difference percentage
      const menteesDiff =
        previousMonthMentees > 0
          ? ((menteesCount - previousMonthMentees) / previousMonthMentees) * 100
          : 0;

      // Get live sessions count (total sessions)
      const liveSessionsCount = allSessions.length;

      // Get previous month sessions count
      const previousMonthSessionsCount = previousMonthSessions.length;

      // Calculate sessions difference percentage
      const sessionsDiff =
        previousMonthSessionsCount > 0
          ? ((liveSessionsCount - previousMonthSessionsCount) /
              previousMonthSessionsCount) *
            100
          : 0;

      return {
        minutesMentored: totalMinutesMentored,
        minutesMentoredDiff: Math.round(minutesDiff * 100) / 100, // Round to 2 decimal places
        mentees: menteesCount,
        menteesDiff: Math.round(menteesDiff * 100) / 100,
        liveSessions: liveSessionsCount,
        liveSessionsDiff: Math.round(sessionsDiff * 100) / 100,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error getting mentor statistics: ${error.message}`,
      );
    }
  }

  async getMyUpcomingSessions(mentorId: number) {
    try {
      // Get upcoming sessions (sessions that haven't started yet)
      const upcomingSessions = await this.prisma.mentorshipSessions.findMany({
        where: {
          mentorId: mentorId,
          dateStart: {
            gt: new Date(), // Sessions that start in the future
          },
        },
        include: {
          mentee: {
            select: {
              first_name: true,
              last_name: true,
              picture_upload_link: true,
              profession: true,
            },
          },
        },
        orderBy: {
          dateStart: 'asc', // Order by start date
        },
        take: 10, // Limit to 10 upcoming sessions
      });

      // Get the last session for each mentee to calculate "last met"
      const upcomingSessionsWithLastMet = await Promise.all(
        upcomingSessions.map(async (session) => {
          // Find the last completed session with this mentee
          const lastSession = await this.prisma.mentorshipSessions.findFirst({
            where: {
              mentorId: mentorId,
              menteeId: session.menteeId,
              dateEnd: {
                lt: new Date(), // Sessions that have ended
              },
            },
            orderBy: {
              dateEnd: 'desc',
            },
          });

          return {
            id: session.id,
            avatar: session.mentee.picture_upload_link,
            mentee: `${session.mentee.first_name} ${session.mentee.last_name}`,
            lastMet: lastSession ? lastSession.dateEnd.toISOString() : null,
            profession: session.mentee.profession || 'Not specified',
            link: session.link || '',
          };
        }),
      );

      return upcomingSessionsWithLastMet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error getting upcoming sessions: ${error.message}`,
      );
    }
  }

  async getMyMentees(mentorId: number) {
    try {
      // Get all mentees matched with this mentor
      const mentees = await this.prisma.matchedMentorMentee.findMany({
        where: {
          mentorId: mentorId,
        },
        include: {
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              mentee: {
                select: {
                  resume: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the data to match the MyMentees entity
      const transformedMentees = mentees.map((matching) => ({
        id: matching.id,
        menteeUserId: matching.mentee.id,
        mentee: `${matching.mentee.first_name} ${matching.mentee.last_name}`,
        email: matching.mentee.email,
        profession: matching.mentee.profession || 'Not specified',
        status: matching.status,
        resume:
          (Array.isArray(matching.mentee.mentee) && matching.mentee.mentee[0]
            ? matching.mentee.mentee[0].resume
            : undefined) || undefined,
      }));

      return transformedMentees;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error getting mentees: ${error.message}`,
      );
    }
  }
}
