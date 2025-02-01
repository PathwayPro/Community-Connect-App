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
          user: true,
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
          user: true,
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

  async findOneByUserId(user_id: number) {
    try {
      const mentor = await this.prisma.mentors.findFirst({
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

      if (!mentor) {
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
        resume: resumeLink.path,
        status: mentors_status.PENDING,
      };

      // CREATE THE MENTOR APPLICATION
      const mentor = await this.prisma.mentors.create({
        data: mentorData,
      });
      if (!mentor) {
        throw new InternalServerErrorException(
          'There was a problema creating your mentorship application. Please try again later.',
        );
      }

      // INTERESTS
      // TRANSFORM STRING OF INTEREST INTO ARRAY
      const interestsToArray = JSON.parse(createMentorDto.interests);

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
      //.then(interests => interests.map(interest => interest.id));

      console.log('INTERESTS: ', validInterestsIds);

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

      return mentor;
    } catch (error) {
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

      if (mentorToUpdate) {
        // Update mentor information
        const updatedMentor = await this.prisma.mentors.update({
          where: { id: mentorToUpdate.id },
          data: updateMentor,
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
            include: {
              mentor: true,
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
}
