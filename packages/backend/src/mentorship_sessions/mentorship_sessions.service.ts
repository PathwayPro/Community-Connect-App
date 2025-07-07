import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import {
  MentorshipSessionMenteeNotesEntity,
  MentorshipSessionRatingEntity,
  MentorshipSessionResponseEntity,
  MatchedMentorMenteeResponseEntity,
} from './entities/mentorship_sessions.entity';
import {
  CreateMentorshipSessionDto,
  CreateSessionMenteeNoteDto,
  CreateSessionRatingDto,
  CreateMatchingDto,
} from './dto/create.dto';
import {
  FilterMentorshipSessionsDto,
  FilterMentorshipSessionRatingsDto,
} from './dto/filter.dto';
import { PrismaService } from 'src/database/prisma.service';
import {
  UpdateMentorshipSessionDto,
  UpdateSessionMenteeNoteDto,
  UpdateMatchingDto,
} from './dto/update.dto';

@Injectable()
export class MentorshipSessionsService {
  constructor(private prisma: PrismaService) {}

  async createMentorshipSession(
    mentorId: number,
    createMentorshipSessionDto: CreateMentorshipSessionDto,
  ): Promise<MentorshipSessionResponseEntity> {
    try {
      // Check if there's already a matching between this mentor and mentee
      const existingMatching = await this.prisma.matchedMentorMentee.findFirst({
        where: {
          mentorId: mentorId,
          menteeId: createMentorshipSessionDto.menteeId,
          status: 'APPROVED',
        },
      });

      if (!existingMatching) {
        throw new NotFoundException(
          'No approved matching found between this mentor and mentee',
        );
      }

      // Create the mentorship session
      const mentorshipSession = await this.prisma.mentorshipSessions.create({
        data: {
          mentorId: mentorId,
          menteeId: createMentorshipSessionDto.menteeId,
          link: createMentorshipSessionDto.link,
          dateStart: createMentorshipSessionDto.dateStart,
          dateEnd: createMentorshipSessionDto.dateEnd,
        },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
        },
      });

      // If description is provided, create the description record
      if (createMentorshipSessionDto.description) {
        await this.prisma.mentorshipSessionsDescriptions.create({
          data: {
            sessionId: mentorshipSession.id,
            description: createMentorshipSessionDto.description,
          },
        });
      }

      // Fetch the complete session with all related data
      const completeSession = await this.prisma.mentorshipSessions.findUnique({
        where: { id: mentorshipSession.id },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          descriptions: true,
          menteeNotes: true,
          mentorRating: true,
          menteeRating: true,
        },
      });

      // Transform the response to match the entity structure
      const response: MentorshipSessionResponseEntity = {
        id: completeSession.id,
        mentorId: completeSession.mentorId,
        menteeId: completeSession.menteeId,
        link: completeSession.link,
        dateStart: completeSession.dateStart,
        dateEnd: completeSession.dateEnd,
        createdAt: completeSession.createdAt,
        updatedAt: completeSession.updatedAt,
        mentor: {
          id: completeSession.mentor.id,
          firstName: completeSession.mentor.first_name,
          lastName: completeSession.mentor.last_name,
          email: completeSession.mentor.email,
          profession: completeSession.mentor.profession,
          avatar: completeSession.mentor.picture_upload_link,
        },
        mentee: {
          id: completeSession.mentee.id,
          firstName: completeSession.mentee.first_name,
          lastName: completeSession.mentee.last_name,
          email: completeSession.mentee.email,
          profession: completeSession.mentee.profession,
          avatar: completeSession.mentee.picture_upload_link,
        },
        description: completeSession.descriptions[0] || undefined,
        menteeNotes: completeSession.menteeNotes[0] || undefined,
        mentorRating: completeSession.mentorRating || undefined,
        menteeRating: completeSession.menteeRating || undefined,
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error creating the mentorship session: ${error.message}`,
      );
    }
  }

  async updateMentorshipSession(
    id: number,
    mentorId: number,
    updateMentorshipSessionDto: UpdateMentorshipSessionDto,
  ): Promise<MentorshipSessionResponseEntity> {
    try {
      // Check if the mentorship session exists and belongs to the mentor
      const existingSession = await this.prisma.mentorshipSessions.findFirst({
        where: {
          id: id,
          mentorId: mentorId,
        },
      });

      if (!existingSession) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${id}`,
        );
      }

      // Prepare the update data
      const updateData: any = {};

      if (updateMentorshipSessionDto.link !== undefined) {
        updateData.link = updateMentorshipSessionDto.link;
      }

      if (updateMentorshipSessionDto.dateStart !== undefined) {
        updateData.dateStart = updateMentorshipSessionDto.dateStart;
      }

      if (updateMentorshipSessionDto.dateEnd !== undefined) {
        updateData.dateEnd = updateMentorshipSessionDto.dateEnd;
      }

      // Update the mentorship session
      await this.prisma.mentorshipSessions.update({
        where: { id: id },
        data: updateData,
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
        },
      });

      // Update description if provided
      if (updateMentorshipSessionDto.description !== undefined) {
        // Check if description already exists
        const existingDescription =
          await this.prisma.mentorshipSessionsDescriptions.findFirst({
            where: { sessionId: id },
          });

        if (existingDescription) {
          // Update existing description
          await this.prisma.mentorshipSessionsDescriptions.update({
            where: { id: existingDescription.id },
            data: { description: updateMentorshipSessionDto.description },
          });
        } else {
          // Create new description
          await this.prisma.mentorshipSessionsDescriptions.create({
            data: {
              sessionId: id,
              description: updateMentorshipSessionDto.description,
            },
          });
        }
      }

      // Fetch the complete updated session with all related data
      const completeSession = await this.prisma.mentorshipSessions.findUnique({
        where: { id: id },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          descriptions: true,
          menteeNotes: true,
          mentorRating: true,
          menteeRating: true,
        },
      });

      // Transform the response to match the entity structure
      const response: MentorshipSessionResponseEntity = {
        id: completeSession.id,
        mentorId: completeSession.mentorId,
        menteeId: completeSession.menteeId,
        link: completeSession.link,
        dateStart: completeSession.dateStart,
        dateEnd: completeSession.dateEnd,
        createdAt: completeSession.createdAt,
        updatedAt: completeSession.updatedAt,
        mentor: {
          id: completeSession.mentor.id,
          firstName: completeSession.mentor.first_name,
          lastName: completeSession.mentor.last_name,
          email: completeSession.mentor.email,
          profession: completeSession.mentor.profession,
          avatar: completeSession.mentor.picture_upload_link,
        },
        mentee: {
          id: completeSession.mentee.id,
          firstName: completeSession.mentee.first_name,
          lastName: completeSession.mentee.last_name,
          email: completeSession.mentee.email,
          profession: completeSession.mentee.profession,
          avatar: completeSession.mentee.picture_upload_link,
        },
        description: completeSession.descriptions[0] || undefined,
        menteeNotes: completeSession.menteeNotes[0] || undefined,
        mentorRating: completeSession.mentorRating || undefined,
        menteeRating: completeSession.menteeRating || undefined,
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error updating mentorship session with ID #${id}: ${error.message}`,
      );
    }
  }

  async removeMentorshipSession(id: number, mentorId: number): Promise<number> {
    try {
      // Check if the mentorship session exists and belongs to the mentor
      const existingSession = await this.prisma.mentorshipSessions.findFirst({
        where: {
          id: id,
          mentorId: mentorId,
        },
      });

      if (!existingSession) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${id} to delete`,
        );
      }

      // Delete related records first (due to foreign key constraints)
      // Delete session descriptions
      await this.prisma.mentorshipSessionsDescriptions.deleteMany({
        where: { sessionId: id },
      });

      // Delete mentee notes
      await this.prisma.mentorshipSessionsMenteeNotes.deleteMany({
        where: { sessionId: id },
      });

      // Delete mentor rating
      await this.prisma.mentorshipSessionsMentorRating.deleteMany({
        where: { sessionId: id },
      });

      // Delete mentee rating
      await this.prisma.mentorshipSessionsMenteeRating.deleteMany({
        where: { sessionId: id },
      });

      // Finally, delete the mentorship session
      await this.prisma.mentorshipSessions.delete({
        where: { id: id },
      });

      return id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error deleting mentorship session with ID #${id}: ${error.message}`,
      );
    }
  }

  async findAllMentorshipSessions(
    filterMentorshipSessionsDto: FilterMentorshipSessionsDto,
    userId: number,
  ): Promise<MentorshipSessionResponseEntity[]> {
    try {
      // Get user role to determine what sessions they can access
      const user = await this.prisma.users.findFirst({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Build the base where clause
      const whereClause: any = {};

      // Add role-based filtering
      if (user.role === 'MENTOR') {
        whereClause.mentorId = userId;
      } else if (user.role === 'MENTEE') {
        whereClause.menteeId = userId;
      } else if (user.role === 'USER') {
        // For regular users, they can see sessions where they are either mentor or mentee
        whereClause.OR = [{ mentorId: userId }, { menteeId: userId }];
      }

      // Add date filters
      if (filterMentorshipSessionsDto.dateStartBefore) {
        whereClause.dateStart = {
          ...whereClause.dateStart,
          lte: filterMentorshipSessionsDto.dateStartBefore,
        };
      }

      if (filterMentorshipSessionsDto.dateStartAfter) {
        whereClause.dateStart = {
          ...whereClause.dateStart,
          gte: filterMentorshipSessionsDto.dateStartAfter,
        };
      }

      // Add mentor/mentee ID filters
      if (filterMentorshipSessionsDto.mentorId) {
        whereClause.mentorId = filterMentorshipSessionsDto.mentorId;
      }

      if (filterMentorshipSessionsDto.menteeId) {
        whereClause.menteeId = filterMentorshipSessionsDto.menteeId;
      }

      // Fetch sessions with all related data
      const sessions = await this.prisma.mentorshipSessions.findMany({
        where: whereClause,
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          descriptions: true,
          menteeNotes: true,
          mentorRating: true,
          menteeRating: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the response to match the entity structure
      const response: MentorshipSessionResponseEntity[] = sessions.map(
        (session) => ({
          id: session.id,
          mentorId: session.mentorId,
          menteeId: session.menteeId,
          link: session.link,
          dateStart: session.dateStart,
          dateEnd: session.dateEnd,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          mentor: {
            id: session.mentor.id,
            firstName: session.mentor.first_name,
            lastName: session.mentor.last_name,
            email: session.mentor.email,
            profession: session.mentor.profession,
            avatar: session.mentor.picture_upload_link,
          },
          mentee: {
            id: session.mentee.id,
            firstName: session.mentee.first_name,
            lastName: session.mentee.last_name,
            email: session.mentee.email,
            profession: session.mentee.profession,
            avatar: session.mentee.picture_upload_link,
          },
          description: session.descriptions[0] || undefined,
          menteeNotes: session.menteeNotes[0] || undefined,
          mentorRating: session.mentorRating || undefined,
          menteeRating: session.menteeRating || undefined,
        }),
      );

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching mentorship sessions: ${error.message}`,
      );
    }
  }

  async findMentorshipSessionsById(
    id: number,
    userId: number,
  ): Promise<MentorshipSessionResponseEntity> {
    try {
      // Get user role to determine what sessions they can access
      const user = await this.prisma.users.findFirst({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Build the base where clause
      const whereClause: any = { id: id };

      // Add role-based filtering
      if (user.role === 'MENTOR') {
        whereClause.mentorId = userId;
      } else if (user.role === 'MENTEE') {
        whereClause.menteeId = userId;
      } else if (user.role === 'USER') {
        // For regular users, they can see sessions where they are either mentor or mentee
        whereClause.OR = [
          { id: id, mentorId: userId },
          { id: id, menteeId: userId },
        ];
      }

      // Fetch the session with all related data
      const session = await this.prisma.mentorshipSessions.findFirst({
        where: whereClause,
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          descriptions: true,
          menteeNotes: true,
          mentorRating: true,
          menteeRating: true,
        },
      });

      if (!session) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${id}`,
        );
      }

      // Transform the response to match the entity structure
      const response: MentorshipSessionResponseEntity = {
        id: session.id,
        mentorId: session.mentorId,
        menteeId: session.menteeId,
        link: session.link,
        dateStart: session.dateStart,
        dateEnd: session.dateEnd,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        mentor: {
          id: session.mentor.id,
          firstName: session.mentor.first_name,
          lastName: session.mentor.last_name,
          email: session.mentor.email,
          profession: session.mentor.profession,
          avatar: session.mentor.picture_upload_link,
        },
        mentee: {
          id: session.mentee.id,
          firstName: session.mentee.first_name,
          lastName: session.mentee.last_name,
          email: session.mentee.email,
          profession: session.mentee.profession,
          avatar: session.mentee.picture_upload_link,
        },
        description: session.descriptions[0] || undefined,
        menteeNotes: session.menteeNotes[0] || undefined,
        mentorRating: session.mentorRating || undefined,
        menteeRating: session.menteeRating || undefined,
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching mentorship sessions by ID: ${error.message}`,
      );
    }
  }

  async createMentorshipSessionMenteeNote(
    sessionId: number,
    menteeId: number,
    createSessionMenteeNoteDto: CreateSessionMenteeNoteDto,
  ): Promise<MentorshipSessionMenteeNotesEntity> {
    try {
      // Check if the mentorship session exists and the user is the mentee
      const existingSession = await this.prisma.mentorshipSessions.findFirst({
        where: {
          id: sessionId,
          menteeId: menteeId,
        },
      });

      if (!existingSession) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${sessionId} for this mentee`,
        );
      }

      // Check if notes already exist for this session
      const existingNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.findFirst({
          where: { sessionId: sessionId },
        });

      if (existingNotes) {
        throw new NotFoundException(
          `Notes already exist for session #${sessionId}. Use update instead.`,
        );
      }

      // Create the mentee notes
      const menteeNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.create({
          data: {
            sessionId: sessionId,
            notes: createSessionMenteeNoteDto.note,
          },
        });

      return {
        id: menteeNotes.id,
        sessionId: menteeNotes.sessionId,
        notes: menteeNotes.notes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error creating mentorship session mentee notes: ${error.message}`,
      );
    }
  }

  async updateMentorshipSessionMenteeNote(
    id: number,
    menteeId: number,
    updateSessionMenteeNoteDto: UpdateSessionMenteeNoteDto,
  ): Promise<MentorshipSessionMenteeNotesEntity> {
    try {
      // Check if the mentee notes exist and belong to the mentee
      const existingNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.findFirst({
          where: {
            id: id,
            session: {
              menteeId: menteeId,
            },
          },
          include: {
            session: true,
          },
        });

      if (!existingNotes) {
        throw new NotFoundException(
          `There is no mentorship session mentee notes with ID #${id}`,
        );
      }

      // Prepare the update data
      const updateData: any = {};

      if (updateSessionMenteeNoteDto.note !== undefined) {
        updateData.notes = updateSessionMenteeNoteDto.note;
      }

      // Update the mentee notes
      const updatedNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.update({
          where: { id: id },
          data: updateData,
        });

      return {
        id: updatedNotes.id,
        sessionId: updatedNotes.sessionId,
        notes: updatedNotes.notes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error updating mentorship session mentee notes with ID #${id}: ${error.message}`,
      );
    }
  }

  async deleteMentorshipSessionMenteeNote(
    id: number,
    menteeId: number,
  ): Promise<number> {
    try {
      // Check if the mentee notes exist and belong to the mentee
      const existingNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.findFirst({
          where: {
            id: id,
            session: {
              menteeId: menteeId,
            },
          },
          include: {
            session: true,
          },
        });

      if (!existingNotes) {
        throw new NotFoundException(
          `There is no mentorship session mentee notes with ID #${id} to delete`,
        );
      }

      // Delete the mentee notes
      await this.prisma.mentorshipSessionsMenteeNotes.delete({
        where: { id: id },
      });

      return id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error deleting mentorship session mentee notes with ID #${id}: ${error.message}`,
      );
    }
  }

  async findAllMentorshipSessionMenteeNotes(
    mentorshipSessionId: number,
    userId: number,
  ): Promise<MentorshipSessionMenteeNotesEntity[]> {
    try {
      // Check if the mentorship session exists and user has access to it as a mentee
      const session = await this.prisma.mentorshipSessions.findFirst({
        where: {
          id: mentorshipSessionId,
          menteeId: userId,
        },
      });

      if (!session) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${mentorshipSessionId} for this user`,
        );
      }

      // Fetch all mentee notes for the session
      const menteeNotes =
        await this.prisma.mentorshipSessionsMenteeNotes.findMany({
          where: { sessionId: mentorshipSessionId },
          orderBy: {
            id: 'desc',
          },
        });

      // Transform the response to match the entity structure
      const response: MentorshipSessionMenteeNotesEntity[] = menteeNotes.map(
        (note) => ({
          id: note.id,
          sessionId: note.sessionId,
          notes: note.notes,
        }),
      );

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching mentorship session mentee notes: ${error.message}`,
      );
    }
  }

  async createMentorshipSessionRating(
    userId: number,
    createSessionRatingDto: CreateSessionRatingDto,
  ): Promise<MentorshipSessionRatingEntity> {
    try {
      // Check if the mentorship session exists and the user is involved
      const session = await this.prisma.mentorshipSessions.findFirst({
        where: {
          id: createSessionRatingDto.sessionId,
          OR: [{ mentorId: userId }, { menteeId: userId }],
        },
      });

      if (!session) {
        throw new NotFoundException(
          `There is no mentorship session with ID #${createSessionRatingDto.sessionId} for this user`,
        );
      }

      // Determine if user is mentor or mentee and create appropriate rating
      if (session.mentorId === userId) {
        // User is the mentor, so they're rating the mentee
        // Check if mentor rating already exists
        const existingMentorRating =
          await this.prisma.mentorshipSessionsMentorRating.findFirst({
            where: { sessionId: createSessionRatingDto.sessionId },
          });

        if (existingMentorRating) {
          throw new NotFoundException(
            `Mentor rating already exists for session #${createSessionRatingDto.sessionId}`,
          );
        }

        // Create mentor rating (mentor rating the mentee)
        const mentorRating =
          await this.prisma.mentorshipSessionsMentorRating.create({
            data: {
              sessionId: createSessionRatingDto.sessionId,
              rate: createSessionRatingDto.rate,
              comment: createSessionRatingDto.note,
            },
          });

        return {
          id: mentorRating.id,
          sessionId: mentorRating.sessionId,
          rate: mentorRating.rate,
          comment: mentorRating.comment,
          createdAt: mentorRating.createdAt,
        };
      } else if (session.menteeId === userId) {
        // User is the mentee, so they're rating the mentor
        // Check if mentee rating already exists
        const existingMenteeRating =
          await this.prisma.mentorshipSessionsMenteeRating.findFirst({
            where: { sessionId: createSessionRatingDto.sessionId },
          });

        if (existingMenteeRating) {
          throw new NotFoundException(
            `Mentee rating already exists for session #${createSessionRatingDto.sessionId}`,
          );
        }

        // Create mentee rating (mentee rating the mentor)
        const menteeRating =
          await this.prisma.mentorshipSessionsMenteeRating.create({
            data: {
              sessionId: createSessionRatingDto.sessionId,
              rate: createSessionRatingDto.rate,
              comment: createSessionRatingDto.note,
            },
          });

        return {
          id: menteeRating.id,
          sessionId: menteeRating.sessionId,
          rate: menteeRating.rate,
          comment: menteeRating.comment,
          createdAt: menteeRating.createdAt,
        };
      } else {
        throw new NotFoundException(
          'User is not involved in this mentorship session',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error creating mentorship session rating: ${error.message}`,
      );
    }
  }

  async findAllMentorshipSessionRatings(
    filterMentorshipSessionRatingsDto: FilterMentorshipSessionRatingsDto,
    userId: number,
  ): Promise<MentorshipSessionRatingEntity[]> {
    try {
      // Get user role to determine what ratings they can access
      const user = await this.prisma.users.findFirst({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let ratings: MentorshipSessionRatingEntity[] = [];

      if (user.role === 'ADMIN') {
        // ADMIN can fetch all ratings from both tables

        // Build filter conditions for mentor ratings
        const mentorRatingWhere: any = {};
        if (filterMentorshipSessionRatingsDto.sessionId) {
          mentorRatingWhere.sessionId =
            filterMentorshipSessionRatingsDto.sessionId;
        }
        if (filterMentorshipSessionRatingsDto.dateStartBefore) {
          mentorRatingWhere.createdAt = {
            ...mentorRatingWhere.createdAt,
            lte: filterMentorshipSessionRatingsDto.dateStartBefore,
          };
        }
        if (filterMentorshipSessionRatingsDto.dateStartAfter) {
          mentorRatingWhere.createdAt = {
            ...mentorRatingWhere.createdAt,
            gte: filterMentorshipSessionRatingsDto.dateStartAfter,
          };
        }

        // Fetch mentor ratings
        const mentorRatings =
          await this.prisma.mentorshipSessionsMentorRating.findMany({
            where: mentorRatingWhere,
            include: {
              session: {
                include: {
                  mentor: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                  mentee: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          });

        // Build filter conditions for mentee ratings
        const menteeRatingWhere: any = {};
        if (filterMentorshipSessionRatingsDto.sessionId) {
          menteeRatingWhere.sessionId =
            filterMentorshipSessionRatingsDto.sessionId;
        }
        if (filterMentorshipSessionRatingsDto.dateStartBefore) {
          menteeRatingWhere.createdAt = {
            ...menteeRatingWhere.createdAt,
            lte: filterMentorshipSessionRatingsDto.dateStartBefore,
          };
        }
        if (filterMentorshipSessionRatingsDto.dateStartAfter) {
          menteeRatingWhere.createdAt = {
            ...menteeRatingWhere.createdAt,
            gte: filterMentorshipSessionRatingsDto.dateStartAfter,
          };
        }

        // Fetch mentee ratings
        const menteeRatings =
          await this.prisma.mentorshipSessionsMenteeRating.findMany({
            where: menteeRatingWhere,
            include: {
              session: {
                include: {
                  mentor: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                  mentee: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          });

        // Transform and combine ratings
        ratings.push(
          ...mentorRatings.map((rating) => ({
            id: rating.id,
            sessionId: rating.sessionId,
            rate: rating.rate,
            comment: rating.comment,
            createdAt: rating.createdAt,
            type: 'MENTOR_RATING' as const,
            session: rating.session,
          })),
          ...menteeRatings.map((rating) => ({
            id: rating.id,
            sessionId: rating.sessionId,
            rate: rating.rate,
            comment: rating.comment,
            createdAt: rating.createdAt,
            type: 'MENTEE_RATING' as const,
            session: rating.session,
          })),
        );
      } else {
        // Non-admin users can only fetch ratings they gave or received

        // Get sessions where user is involved
        const userSessions = await this.prisma.mentorshipSessions.findMany({
          where: {
            OR: [{ mentorId: userId }, { menteeId: userId }],
          },
          select: { id: true, mentorId: true, menteeId: true },
        });

        const sessionIds = userSessions.map((session) => session.id);

        // Build filter conditions
        const whereClause: any = {
          sessionId: { in: sessionIds },
        };

        if (filterMentorshipSessionRatingsDto.sessionId) {
          whereClause.sessionId = filterMentorshipSessionRatingsDto.sessionId;
        }
        if (filterMentorshipSessionRatingsDto.dateStartBefore) {
          whereClause.createdAt = {
            ...whereClause.createdAt,
            lte: filterMentorshipSessionRatingsDto.dateStartBefore,
          };
        }
        if (filterMentorshipSessionRatingsDto.dateStartAfter) {
          whereClause.createdAt = {
            ...whereClause.createdAt,
            gte: filterMentorshipSessionRatingsDto.dateStartAfter,
          };
        }

        // Fetch mentor ratings for user's sessions
        const mentorRatings =
          await this.prisma.mentorshipSessionsMentorRating.findMany({
            where: whereClause,
            include: {
              session: {
                include: {
                  mentor: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                  mentee: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          });

        // Fetch mentee ratings for user's sessions
        const menteeRatings =
          await this.prisma.mentorshipSessionsMenteeRating.findMany({
            where: whereClause,
            include: {
              session: {
                include: {
                  mentor: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                  mentee: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          });

        // Transform and combine ratings
        ratings.push(
          ...mentorRatings.map((rating) => ({
            id: rating.id,
            sessionId: rating.sessionId,
            rate: rating.rate,
            comment: rating.comment,
            createdAt: rating.createdAt,
            type: 'MENTOR_RATING' as const,
            session: rating.session,
          })),
          ...menteeRatings.map((rating) => ({
            id: rating.id,
            sessionId: rating.sessionId,
            rate: rating.rate,
            comment: rating.comment,
            createdAt: rating.createdAt,
            type: 'MENTEE_RATING' as const,
            session: rating.session,
          })),
        );
      }

      // Apply additional filters for mentor/mentee IDs if provided
      if (
        filterMentorshipSessionRatingsDto.mentorId ||
        filterMentorshipSessionRatingsDto.menteeId
      ) {
        ratings = ratings.filter((rating) => {
          if (
            filterMentorshipSessionRatingsDto.mentorId &&
            rating.session.mentor.id !==
              filterMentorshipSessionRatingsDto.mentorId
          ) {
            return false;
          }
          if (
            filterMentorshipSessionRatingsDto.menteeId &&
            rating.session.mentee.id !==
              filterMentorshipSessionRatingsDto.menteeId
          ) {
            return false;
          }
          return true;
        });
      }

      return ratings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching mentorship session rating: ${error.message}`,
      );
    }
  }

  async createMatching(
    createMatchingDto: CreateMatchingDto,
  ): Promise<MatchedMentorMenteeResponseEntity> {
    try {
      // Validate that the mentor exists and has MENTOR role
      const mentor = await this.prisma.users.findFirst({
        where: {
          id: createMatchingDto.mentorId,
          deleted_at: false,
          role: 'MENTOR',
        },
      });

      if (!mentor) {
        throw new NotFoundException(
          `Mentor with ID ${createMatchingDto.mentorId} not found or not authorized`,
        );
      }

      // Validate that the mentee exists and has MENTEE role
      const mentee = await this.prisma.users.findFirst({
        where: {
          id: createMatchingDto.menteeId,
          deleted_at: false,
          role: 'MENTEE',
        },
      });

      if (!mentee) {
        throw new NotFoundException(
          `Mentee with ID ${createMatchingDto.menteeId} not found or not authorized`,
        );
      }

      // Check if a matching already exists between this mentor and mentee
      const existingMatching = await this.prisma.matchedMentorMentee.findFirst({
        where: {
          mentorId: createMatchingDto.mentorId,
          menteeId: createMatchingDto.menteeId,
        },
      });

      if (existingMatching) {
        throw new NotFoundException(
          'A matching already exists between this mentor and mentee',
        );
      }

      // Create the matching
      const matching = await this.prisma.matchedMentorMentee.create({
        data: {
          mentorId: createMatchingDto.mentorId,
          menteeId: createMatchingDto.menteeId,
          status: 'PENDING',
        },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
        },
      });

      // Transform the response to match the entity structure
      const response: MatchedMentorMenteeResponseEntity = {
        id: matching.id,
        mentorId: matching.mentorId,
        menteeId: matching.menteeId,
        status: matching.status,
        createdAt: matching.createdAt,
        mentor: {
          id: matching.mentor.id,
          firstName: matching.mentor.first_name,
          lastName: matching.mentor.last_name,
          email: matching.mentor.email,
          profession: matching.mentor.profession,
          avatar: matching.mentor.picture_upload_link,
        },
        mentee: {
          id: matching.mentee.id,
          firstName: matching.mentee.first_name,
          lastName: matching.mentee.last_name,
          email: matching.mentee.email,
          profession: matching.mentee.profession,
          avatar: matching.mentee.picture_upload_link,
        },
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error matching MENTOR with MENTEE: ${error.message}`,
      );
    }
  }

  async updateMatchingStatus(
    id: number,
    updateMatchingDto: UpdateMatchingDto,
    mentorId: number,
  ): Promise<MatchedMentorMenteeResponseEntity> {
    try {
      // Check if the matching exists and belongs to the mentor
      const existingMatching = await this.prisma.matchedMentorMentee.findFirst({
        where: {
          id: id,
          mentorId: mentorId,
        },
      });

      if (!existingMatching) {
        throw new NotFoundException(
          `There is no matching with ID #${id} to update`,
        );
      }

      // Update the matching status
      const updatedMatching = await this.prisma.matchedMentorMentee.update({
        where: { id: id },
        data: {
          status: updateMatchingDto.status,
        },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
          mentee: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
            },
          },
        },
      });

      // Transform the response to match the entity structure
      const response: MatchedMentorMenteeResponseEntity = {
        id: updatedMatching.id,
        mentorId: updatedMatching.mentorId,
        menteeId: updatedMatching.menteeId,
        status: updatedMatching.status,
        createdAt: updatedMatching.createdAt,
        mentor: {
          id: updatedMatching.mentor.id,
          firstName: updatedMatching.mentor.first_name,
          lastName: updatedMatching.mentor.last_name,
          email: updatedMatching.mentor.email,
          profession: updatedMatching.mentor.profession,
          avatar: updatedMatching.mentor.picture_upload_link,
        },
        mentee: {
          id: updatedMatching.mentee.id,
          firstName: updatedMatching.mentee.first_name,
          lastName: updatedMatching.mentee.last_name,
          email: updatedMatching.mentee.email,
          profession: updatedMatching.mentee.profession,
          avatar: updatedMatching.mentee.picture_upload_link,
        },
      };

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error updating matching with ID #${id}: ${error.message}`,
      );
    }
  }

  async findAllMatchingForMentor(mentorId: number): Promise<any[]> {
    try {
      // Validate that the mentor exists
      const mentor = await this.prisma.users.findFirst({
        where: {
          id: mentorId,
          deleted_at: false,
          role: 'MENTOR',
        },
      });

      if (!mentor) {
        throw new NotFoundException(`Mentor with ID ${mentorId} not found`);
      }

      // Get all mentees that are matched with this mentor
      const matchings = await this.prisma.matchedMentorMentee.findMany({
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
              picture_upload_link: true,
              bio: true,
              experience: true,
              company_name: true,
              linkedin_link: true,
              github_link: true,
              portfolio_link: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the response to match the User entity structure
      const mentees = matchings.map((matching) => ({
        id: matching.mentee.id,
        first_name: matching.mentee.first_name,
        last_name: matching.mentee.last_name,
        email: matching.mentee.email,
        profession: matching.mentee.profession,
        picture_upload_link: matching.mentee.picture_upload_link,
        bio: matching.mentee.bio,
        experience: matching.mentee.experience,
        company_name: matching.mentee.company_name,
        linkedin_link: matching.mentee.linkedin_link,
        github_link: matching.mentee.github_link,
        portfolio_link: matching.mentee.portfolio_link,
      }));

      return mentees;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching matching users: ${error.message}`,
      );
    }
  }

  async findAllMatchingForMentee(menteeId: number): Promise<any[]> {
    try {
      // Validate that the mentee exists
      const mentee = await this.prisma.users.findFirst({
        where: {
          id: menteeId,
          deleted_at: false,
          role: 'MENTEE',
        },
      });

      if (!mentee) {
        throw new NotFoundException(`Mentee with ID ${menteeId} not found`);
      }

      // Get all mentors that are matched with this mentee
      const matchings = await this.prisma.matchedMentorMentee.findMany({
        where: {
          menteeId: menteeId,
        },
        include: {
          mentor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profession: true,
              picture_upload_link: true,
              bio: true,
              experience: true,
              company_name: true,
              linkedin_link: true,
              github_link: true,
              portfolio_link: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the response to match the User entity structure
      const mentors = matchings.map((matching) => ({
        id: matching.mentor.id,
        first_name: matching.mentor.first_name,
        last_name: matching.mentor.last_name,
        email: matching.mentor.email,
        profession: matching.mentor.profession,
        picture_upload_link: matching.mentor.picture_upload_link,
        bio: matching.mentor.bio,
        experience: matching.mentor.experience,
        company_name: matching.mentor.company_name,
        linkedin_link: matching.mentor.linkedin_link,
        github_link: matching.mentor.github_link,
        portfolio_link: matching.mentor.portfolio_link,
      }));

      return mentors;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error fetching matching users: ${error.message}`,
      );
    }
  }

  // ... other methods will be implemented here
}
