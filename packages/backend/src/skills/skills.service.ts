import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/database';
import { SkillToUserDto } from './dto/skill-to-user.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    try {
      const skill = await this.prisma.skills.create({
        data: createSkillDto,
      });
      return skill;
    } catch (error) {
      throw new BadRequestException('Error creating skill: ' + error.message);
    }
  }

  async findAll() {
    try {
      const skills = await this.prisma.skills.findMany();
      return skills;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const skill = await this.prisma.skills.findFirst({
        where: { id },
      });

      if (!skill) {
        throw new NotFoundException(`There is no skill with ID: ${id}.`);
      }

      return skill;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      // Validate skill existence
      const skillToUpdate = await this.findOne(id);

      if (skillToUpdate) {
        // Update skill information
        const updatedSkill = await this.prisma.skills.update({
          where: { id },
          data: updateSkillDto,
        });

        return updatedSkill;
      } else {
        throw new NotFoundException(`Skill with ID: ${id} not found.`);
      }
    } catch (error) {
      throw new BadRequestException('Error updating skill: ' + error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }

  async addSkillToUser(skillToUserDto: SkillToUserDto) {
    try {
      // Validate user exists
      const user = await this.prisma.users.findFirst({
        where: { id: skillToUserDto.user_id },
      });
      if (!user) {
        throw new NotFoundException(
          `There is no user with ID: ${skillToUserDto.user_id}.`,
        );
      }

      // Validate skill exists
      const skill = await this.findOne(skillToUserDto.skill_id);
      if (!skill) {
        throw new NotFoundException(
          `There is no skill with ID: ${skillToUserDto.skill_id}.`,
        );
      }

      // Validate user-skill doesn't exist
      const userSkill = await this.prisma.usersSkills.findFirst({
        where: skillToUserDto,
      });
      if (userSkill) {
        // throw new BadRequestException(
        //   `User ${user.first_name} ${user.last_name} (ID #${user.id}) is already associated with "${skill.name}" (ID #${skill.id}).`,
        // );
        return userSkill;
      }

      // Add user-skill
      const addedSkillToUser = await this.prisma.usersSkills.create({
        data: skillToUserDto,
      });

      return addedSkillToUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeSkillFromUser(skillToUserDto: SkillToUserDto) {
    try {
      // Validate user exists
      const user = await this.prisma.users.findFirst({
        where: { id: skillToUserDto.user_id },
      });
      if (!user) {
        throw new NotFoundException(
          `There is no user with ID: ${skillToUserDto.user_id}.`,
        );
      }

      // Validate skill exists
      const skill = await this.findOne(skillToUserDto.skill_id);
      if (!skill) {
        throw new NotFoundException(
          `There is no skill with ID: ${skillToUserDto.skill_id}.`,
        );
      }

      // Validate user-skill exist
      const userSkill = await this.prisma.usersSkills.findFirst({
        where: skillToUserDto,
      });
      if (!userSkill) {
        throw new BadRequestException(
          `User ${user.first_name} ${user.last_name} (ID #${user.id}) is not associated with "${skill.name}" (ID #${skill.id}).`,
        );
      }

      // Remove user-skill
      const removesSkillFromUser = await this.prisma.usersSkills.deleteMany({
        where: skillToUserDto,
      });

      return removesSkillFromUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
