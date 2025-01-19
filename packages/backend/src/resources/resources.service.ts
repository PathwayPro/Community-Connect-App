import { InternalServerErrorException, NotFoundException, UnauthorizedException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { PrismaService } from 'src/database';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResourcesService {
  
  constructor(private prisma: PrismaService){}

  getFormattedFilters(filters: FilterResourceDto): Prisma.ResourcesWhereInput {
      const formattedFilters: Prisma.ResourcesWhereInput = {};
  
      if (filters?.title) {
        formattedFilters.title = {
          contains: filters.title,
          mode: 'insensitive',
        };
      }
      if (filters?.link) {
        formattedFilters.link = {
          contains: filters.link,
          mode: 'insensitive',
        };
      }
      if (filters?.user_id) {
        formattedFilters.user_id = filters.user_id;
        
      }
      if (filters?.date_from && filters?.date_to) {
        formattedFilters.created_at = {
          gte: filters.date_from,
          lte: filters.date_to,
        };
      } else if (filters?.date_from) {
        formattedFilters.created_at = {
          gte: filters.date_from,
        };
      } else if (filters?.date_to) {
        formattedFilters.created_at = {
          lte: filters.date_to,
        };
      }
  
      console.log('APPLIED FILTERS:', formattedFilters);
  
      return formattedFilters;
    }

  async create(user: JwtPayload, createResourceDto: CreateResourceDto) {
    try{
      const data = {
        ...createResourceDto,
        user_id: user.sub
      };
      const newResource = await this.prisma.resources.create({data})
      
      return newResource;

    }catch(error){
      throw new InternalServerErrorException('There was an error creating the resource:', error.message)
    }
  }

  async findAll(filters: FilterResourceDto) {
    try{
      const formattedFilters: Prisma.ResourcesWhereInput = this.getFormattedFilters(filters);
      
      const filteredResources = this.prisma.resources.findMany({where: formattedFilters});

      return filteredResources;
    }catch(error){
      throw new InternalServerErrorException('Error fetching resources:', error.message);
    }
  }

  async findOne(id: number) {
    try{
      const resource = await this.prisma.resources.findFirst({where: {id}})
      
      if(!resource){
        throw new NotFoundException(`There is no Resource with ID #${id}`);
      }

      return resource;
    }catch(error){
      throw new InternalServerErrorException(`Error fetching resource with ID #${id}:`, error.message);
    }
  }

  async update(user: JwtPayload, id: number, updateResourceDto: UpdateResourceDto) {
    try{
      // Validate resource exist
      const resourceToUpdate = await this.findOne(id);
      if(!resourceToUpdate){
        throw new NotFoundException(`There is no resource with ID #${id}`);
      }

      // MENTOR can only edit their own resources
      if(user.roles !== 'ADMIN' && user.sub !== resourceToUpdate.user_id){
        throw new UnauthorizedException('You are not authorized to edit this resource');
      }

      // Update resource information
      const data = {
        ...updateResourceDto, 
        updated_at: new Date()
      };

      const updatedResource = await this.prisma.resources.update({
        where: { id },
        data: data,
      });

      return updatedResource;

    } catch (error) {
      throw new InternalServerErrorException(`Error updating resource with ID #${id}: ${error.message}`);
    }
  }

  async remove(user: JwtPayload, id: number) {
    try {
      // VALIDATE RESOURCE EXIST
      const resourceToDelete = await this.findOne(id); 
      if(!resourceToDelete){throw new NotFoundException(`There is no resource with ID #${id} to delete`);}

      // MENTOR can only delete their own resources
      if(user.roles !== 'ADMIN' && user.sub !== resourceToDelete.user_id){
        throw new UnauthorizedException('You are not authorized to delete this resource');
      }

      const deletedResource = await this.prisma.resources.delete({where: {id}});
      
      return deletedResource;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
