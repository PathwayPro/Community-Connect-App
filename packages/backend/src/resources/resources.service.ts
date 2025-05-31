import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  getFormattedFilters(filters: FilterResourceDto): Prisma.ResourcesWhereInput {
    const formattedFilters: Prisma.ResourcesWhereInput = {};

    if (filters?.title) {
      formattedFilters.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }
    if (filters?.details) {
      formattedFilters.details = {
        contains: filters.details,
        mode: 'insensitive',
      };
    }
    if (filters?.user_id) {
      formattedFilters.user_id = +filters.user_id;
    }
    if (filters?.type) {
      formattedFilters.type = filters.type;
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

  async create(
    user: JwtPayload,
    createResourceDto: CreateResourceDto,
    file?: Express.Multer.File,
  ) {
    try {
      let fileLink = null;

      // Only attempt file upload if a file was provided
      if (file) {
        const uploadedFile = await this.filesService.upload(
          FileValidationEnum.RESOURCES,
          file,
        );

        if (!uploadedFile) {
          throw new BadRequestException('Failed to upload file');
        }

        fileLink = `${uploadedFile.path}/${uploadedFile.fileName}`;
      }

      const data = {
        ...createResourceDto,
        user_id: user.sub,
        file: fileLink,
      };

      const newResource = await this.prisma.resources.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
        },
      });

      return newResource;
    } catch (error) {
      console.error('Error creating resource:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an error creating the resource:',
        error.message,
      );
    }
  }

  async findAll(filters: FilterResourceDto) {
    try {
      const formattedFilters: Prisma.ResourcesWhereInput =
        this.getFormattedFilters(filters);

      const filteredResources = this.prisma.resources.findMany({
        where: formattedFilters,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
        },
      });

      return filteredResources;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching resources:',
        error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const resource = await this.prisma.resources.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
        },
      });

      if (!resource) {
        throw new NotFoundException(`There is no Resource with ID #${id}`);
      }

      return resource;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching resource with ID #${id}:`,
        error.message,
      );
    }
  }

  async update(
    user: JwtPayload,
    id: number,
    updateResourceDto: UpdateResourceDto,
    file?: Express.Multer.File,
  ) {
    try {
      // Validate resource exist
      const resourceToUpdate = await this.findOne(id);
      if (!resourceToUpdate) {
        throw new NotFoundException(`There is no resource with ID #${id}`);
      }

      // MENTOR can only edit their own resources
      if (user.roles !== 'ADMIN' && user.sub !== resourceToUpdate.user_id) {
        throw new UnauthorizedException(
          'You are not authorized to edit this resource',
        );
      }

      let fileLink = resourceToUpdate.file;

      // Only attempt file upload if a new file was provided
      if (file) {
        const uploadedFile = await this.filesService.upload(
          FileValidationEnum.RESOURCES,
          file,
        );

        if (!uploadedFile) {
          throw new BadRequestException('Failed to upload file');
        }

        fileLink = `${uploadedFile.path}/${uploadedFile.fileName}`;
      }

      // Update resource information
      const data = {
        ...updateResourceDto,
        updated_at: new Date(),
        file: fileLink,
      };

      const updatedResource = await this.prisma.resources.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              role: true,
            },
          },
        },
      });

      return updatedResource;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating resource with ID #${id}: ${error.message}`,
        error.message,
      );
    }
  }

  async remove(user: JwtPayload, id: number) {
    try {
      // VALIDATE RESOURCE EXIST
      const resourceToDelete = await this.findOne(id);
      if (!resourceToDelete) {
        throw new NotFoundException(`There is no resource with ID #${id}`);
      }

      // MENTOR can only delete their own resources
      if (user.roles !== 'ADMIN' && user.sub !== resourceToDelete.user_id) {
        throw new UnauthorizedException(
          'You are not authorized to delete this resource',
        );
      }

      await this.prisma.resources.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting resource with ID #${id}: ${error.message}`,
        error.message,
      );
    }
  }
}
