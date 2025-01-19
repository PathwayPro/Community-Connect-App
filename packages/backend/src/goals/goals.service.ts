import { BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/database';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(createGoalDto: CreateGoalDto) {
    try {
      const goal = await this.prisma.usersGoals.create({
        data: createGoalDto,
      });
      return goal;
    } catch (error) {
      throw new BadRequestException(
        'Error creating goal: ' + error.message,
      );
    }
  }

  async findAll() {
    try {
      const goals = await this.prisma.usersGoals.findMany();
      return goals;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const goal = await this.prisma.usersGoals.findFirst({
        where: { id },
      });

      if (!goal) {
        throw new NotFoundException(`There is no goal with ID: ${id}.`);
      }

      return goal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
      try {
        // Validate goal existence
        const goalToUpdate = await this.findOne(id);
  
        if (goalToUpdate) {
          // Update goal information
          const updatedGoal = await this.prisma.usersGoals.update({
            where: { id },
            data: updateGoalDto,
          });
  
          return updatedGoal;
        } else {
          throw new NotFoundException(`Goal with ID: ${id} not found.`);
        }
      } catch (error) {
        throw new BadRequestException(
          'Error updating goal: ' + error.message,
        );
      }
    }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
