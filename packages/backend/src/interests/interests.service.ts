import { BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { PrismaService } from 'src/database';
import { InterestToUserDto } from './dto/interest-to-user.dto';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async create(createInterestDto: CreateInterestDto) {
       try {
         const interest = await this.prisma.interests.create({
           data: createInterestDto,
         });
         return interest;
       } catch (error) {
         throw new BadRequestException(
           'Error creating interest: ' + error.message,
         );
       }
     }

  async findAll() {
    try {
      const interests = await this.prisma.interests.findMany();
      return interests;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const interest = await this.prisma.interests.findFirst({
        where: { id },
      });

      if (!interest) {
        throw new NotFoundException(`There is no interest with ID: ${id}.`);
      }

      return interest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateInterestDto: UpdateInterestDto) {
    try {
      // Validate interest existence
      const interestToUpdate = await this.findOne(id);

      if (interestToUpdate) {
        // Update interest information
        const updatedInterest = await this.prisma.interests.update({
          where: { id },
          data: updateInterestDto,
        });

        return updatedInterest;
      } else {
        throw new NotFoundException(`Interest with ID: ${id} not found.`);
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating interest: ' + error.message,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} interest`;
  }

  async addInterestToUser(interestToUserDto: InterestToUserDto){
    try{
      // Validate user exists
      const user = await this.prisma.users.findFirst({where:{id:interestToUserDto.user_id}})
      if (!user) {throw new NotFoundException(`There is no user with ID: ${interestToUserDto.user_id}.`);}

      
      // Validate interest exists
      const interest = await this.findOne(interestToUserDto.interest_id)
      if (!interest) {throw new NotFoundException(`There is no interest with ID: ${interestToUserDto.interest_id}.`);}

      // Validate user-interest doesn't exist
      const userInterest = await this.prisma.usersInterests.findFirst({where:interestToUserDto})
      if (userInterest) {
        throw new BadRequestException(`User ${user.first_name} ${user.last_name} (ID #${user.id}) is already associated with "${interest.name}" (ID #${interest.id}).`);
      }

      // Add user-interest
      const addedInterestToUser = await this.prisma.usersInterests.create({data: interestToUserDto})

      return addedInterestToUser;

    }catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeInterestFromUser(interestToUserDto: InterestToUserDto){
    try{
      // Validate user exists
      const user = await this.prisma.users.findFirst({where:{id:interestToUserDto.user_id}})
      if (!user) {throw new NotFoundException(`There is no user with ID: ${interestToUserDto.user_id}.`);}
      
      // Validate interest exists
      const interest = await this.findOne(interestToUserDto.interest_id)
      if (!interest) {throw new NotFoundException(`There is no interest with ID: ${interestToUserDto.interest_id}.`);}

      // Validate user-interest exist
      const userInterest = await this.prisma.usersInterests.findFirst({where:interestToUserDto})
      if (!userInterest) {
        throw new BadRequestException(`User ${user.first_name} ${user.last_name} (ID #${user.id}) is not associated with "${interest.name}" (ID #${interest.id}).`);
      }

      // Remove user-interest
      const removesInterestFromUser = await this.prisma.usersInterests.deleteMany({where: interestToUserDto})

      return removesInterestFromUser;

    }catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }
}
