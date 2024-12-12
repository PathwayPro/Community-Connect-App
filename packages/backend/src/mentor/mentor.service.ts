import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    /* ONLY TO SHOW EXCEPTION BEFORE MIDDLEWARE/INTERCEPTOR IMPLEMENTATION */
    const authorizedAcces = true;
    if (!authorizedAcces)
      throw new UnauthorizedException('Unauthorized access');
    /* - - - END AUTH EXCEPTION - - - */

    try {
      const mentors = await this.prisma.user.findMany({
        where: {
          AND: [{ role: 'MENTOR' }, { mentor: { isNot: null } }],
        },
        include: {
          mentor: true,
        },
      });
      return mentors;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneById(userId: number) {
    try {
      const mentor = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: userId },
            { role: 'MENTOR' },
            { mentor: { isNot: null } },
          ],
        },
        include: {
          mentor: true,
        },
      });
      return mentor;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createMentorDto: CreateMentorDto) {
    try {
      const mentor = await this.prisma.mentor.create({
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
      const mentorToUpdate = await this.prisma.mentor.findUnique({
        where: { id },
      });
      if (!mentorToUpdate) {
        throw new BadRequestException(
          'The requested mentor information does not exists',
        );
      }

      // Update mentor information
      const updatedMentor = await this.prisma.mentor.update({
        where: { id },
        data: updateMentor,
      });

      // TO-DO: If status = 'APPROVED' => user.role = 'MENTOR' || user.role = 'USER'

      return updatedMentor;
    } catch (error) {
      throw new BadRequestException('Error updating mentor: ' + error.message);
    }
  }

  remove(id: number) {
    // TO-DO: REMOVE MENTOR INFORMATION? OR CHANGE STATUS TO "REJECTED" OR "DELETED" TO KEEP THE INFORMATION?
    return `This action removes a #${id} mentor`;
  }
}
