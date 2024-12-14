import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterMentorDto } from './dto/filter-mentor.dto';
import { Prisma, users_roles } from '@prisma/client';

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterMentorDto = null) {
    /* ONLY TO SHOW EXCEPTION BEFORE MIDDLEWARE/INTERCEPTOR IMPLEMENTATION */
    const authorizedAcces = true;
    if (!authorizedAcces)
      throw new UnauthorizedException('Unauthorized access');
    /* - - - END AUTH EXCEPTION - - - */

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
      appliedFilters.has_experience = filters.has_experience;
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

  async create(createMentorDto: CreateMentorDto) {
    try {
      const mentor = await this.prisma.mentors.create({
        data: createMentorDto,
      });

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

  async update(id: number, updateMentor: UpdateMentorDto) {
    try {
      // Validate mentor existence
      const mentorToUpdate = await this.findOneById(id);

      if (mentorToUpdate) {
        // Update mentor information
        const updatedMentor = await this.prisma.mentors.update({
          where: { id },
          data: updateMentor,
        });

        return updatedMentor;
      } else {
        throw new NotFoundException(
          `Mentor application with ID: ${id} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Error updating mentor: ' + error.message);
    }
  }

  async updateStatus(id: number, updateMentor: UpdateMentorDto) {
    try {
      // Validate mentor existence
      const mentorToUpdate = await this.findOneById(id);

      if (mentorToUpdate) {
        // Update mentor status
        const updatedMentor = await this.prisma.mentors.update({
          where: { id },
          data: updateMentor,
        });

        // Update user role according to status
        if (updatedMentor) {
          console.log('LLEGA AL UPDATE USER');
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
            `There was an error updating the mentor application with ID: ${id}`,
          );
        }
      } else {
        throw new NotFoundException(
          `Mentor application with ID: ${id} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Error updating mentor: ' + error.message);
    }
  }

  remove(id: number) {
    // TO-DO: REMOVE MENTOR INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?
    return `This action removes a #${id} mentor`;
  }
}
