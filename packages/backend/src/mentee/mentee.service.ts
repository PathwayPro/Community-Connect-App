import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenteeDto } from './dto/create-mentee.dto';
import { UpdateMenteeDto } from './dto/update-mentee.dto';
import { PrismaService } from 'src/database';
import { FilterMenteeDto } from './dto/filter-mentee.dto';
import { Prisma, mentees_status } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';

@Injectable()
export class MenteeService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  private async addUserInterestsFormatted(
    user_id: number,
    interests: string | number[],
  ) {
    try {
      // TRANSFORM STRING OF INTEREST INTO ARRAY
      // const interestsToArray = typeof interests === 'string' ? JSON.parse(interests) : interests;
      const interestsToArray =
        typeof interests === 'string'
          ? JSON.parse(interests).map((item: any) => parseInt(item, 10))
          : interests.map((item: any) => parseInt(item, 10));

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

  async findAll(filters: FilterMenteeDto = null) {
    const appliedFilters: Prisma.menteesWhereInput = {};

    if (filters?.status) {
      appliedFilters.status = filters.status;
    }

    try {
      const mentees = await this.prisma.mentees.findMany({
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
      return mentees;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneById(id: number) {
    try {
      const mentee = await this.prisma.mentees.findFirst({
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

      if (!mentee) {
        throw new NotFoundException(
          `There is no mentee application with ID: ${id}. Make sure you are not using a user ID`,
        );
      }

      return mentee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findOneByUserId(user_id: number, raiseError: boolean = true) {
    try {
      const mentee = await this.prisma.mentees.findFirst({
        where: { user_id },
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

      if (!mentee && raiseError) {
        throw new NotFoundException(
          `There is no mentee application for this user (USER ID: ${user_id}).`,
        );
      }

      return mentee;
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
    createMenteeDto: CreateMenteeDto,
    file: Express.Multer.File,
  ) {
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
      const menteeData = {
        reason: createMenteeDto.reason,
        user: { connect: { id: user_id } },
        resume: resumeLink.path + '/' + resumeLink.fileName,
        status: mentees_status.PENDING,
      };

      // CREATE THE MENTEE APPLICATION
      const mentee = await this.prisma.mentees.create({
        data: menteeData,
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
      if (!mentee) {
        throw new InternalServerErrorException(
          'There was a problema creating your mentorship application. Please try again later.',
        );
      }

      // INTERESTS
      const menteeInterests = !createMenteeDto.interests
        ? []
        : await this.addUserInterestsFormatted(
            user_id,
            createMenteeDto.interests,
          );

      return { ...mentee, interests: menteeInterests };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Mentee already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('The associated user does not exists');
      }
      throw new BadRequestException('Error creating mentee: ' + error.message);
    }
  }

  async update(user_id: number, updateMentee: UpdateMenteeDto) {
    try {
      // Validate mentee existence
      const menteeToUpdate = await this.findOneByUserId(user_id);

      // Update interests first to get them directly when updating mentee application
      if (updateMentee.interests) {
        const updatedInterests = await this.addUserInterestsFormatted(
          user_id,
          updateMentee.interests,
        );
        if (!updatedInterests) {
          throw new InternalServerErrorException(
            'There was an error updating your interests. Please try again later.',
          );
        }
      }

      // Update mentee application and select data to return
      if (menteeToUpdate) {
        // Update mentee information
        const dataToUpdate: Prisma.menteesUncheckedUpdateInput = {
          reason: updateMentee.reason,
        };
        const updatedMentee = await this.prisma.mentees.update({
          where: { id: menteeToUpdate.id },
          data: dataToUpdate,
          select: {
            reason: true,
            status: true,
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

        return updatedMentee;
      } else {
        throw new NotFoundException(
          `Mentee application user with ID: ${user_id} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Error updating mentee: ' + error.message);
    }
  }

  async updateStatus(
    menteeApplicationId: number,
    updateMentee: UpdateMenteeDto,
  ) {
    try {
      // Validate mentee existence
      const menteeToUpdate = await this.findOneById(menteeApplicationId);

      if (menteeToUpdate) {
        // Update mentee status
        const updatedMentee = await this.prisma.mentees.update({
          where: { id: menteeApplicationId },
          data: updateMentee,
        });

        // Update user role to "MENTEE" to handle as mentors?
        if (updatedMentee) {
          //const userId = updatedMentee.user_id;
          //const userRole: users_roles = updatedMentee.status === 'APPROVED' ? 'MENTEE' : 'USER';

          return updatedMentee;
        } else {
          throw new InternalServerErrorException(
            `There was an error updating the mentee application with ID: ${menteeApplicationId}`,
          );
        }
      } else {
        throw new NotFoundException(
          `Mentee application with ID: ${menteeApplicationId} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating mentee application status: ' + error.message,
      );
    }
  }

  remove(id: number) {
    // TO-DO: REMOVE MENTEE INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?
    return `This action removes a #${id} mentee`;
  }
}
