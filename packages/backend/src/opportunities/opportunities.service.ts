import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { FilterOpportunityDto } from './dto/filter-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';

@Injectable()
export class OpportunitiesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  getFormattedFilters(
    filters: FilterOpportunityDto,
  ): Prisma.OpportunitiesWhereInput {
    const formattedFilters: Prisma.OpportunitiesWhereInput = {};

    if (filters?.job) {
      formattedFilters.job = {
        contains: filters.job,
        mode: 'insensitive',
      };
    }
    if (filters?.company) {
      formattedFilters.company = {
        contains: filters.company,
        mode: 'insensitive',
      };
    }
    if (filters?.description) {
      formattedFilters.description = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }
    if (filters?.province) {
      formattedFilters.province = filters.province;
    }
    if (filters?.city) {
      formattedFilters.city = filters.city;
    }
    if (filters?.salary_range_id) {
      formattedFilters.salary_range_id = +filters.salary_range_id;
    }
    if (filters?.settings) {
      formattedFilters.settings = filters.settings;
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

  async uploadImage(file: Express.Multer.File) {
    // UPLOAD COMPANY LOGO TO GET THE LINK
    const imageLink = await this.filesService.upload(
      FileValidationEnum.LOGO,
      file,
    );
    if (!imageLink) {
      throw new InternalServerErrorException(
        'There was a problem uploading the company logo. Please try again later',
      );
    }
    return imageLink;
  }

  async create(
    createOpportunityDto: CreateOpportunityDto,
    file: Express.Multer.File,
  ) {
    try {
      const image = file ? await this.uploadImage(file) : null;

      const data = {
        job: createOpportunityDto.job,
        company: createOpportunityDto.company,
        province: createOpportunityDto.province,
        city: createOpportunityDto.city,
        settings: createOpportunityDto.settings,
        link_apply: createOpportunityDto.link_apply,
        link_post: createOpportunityDto.link_post,
        description: createOpportunityDto.description,
        created_at: new Date(),
        updated_at: new Date(),
        image: image ? image.path + '/' + image.fileName : null,
        salary_range: {
          connect: { id: createOpportunityDto.salary_range_id },
        },
      };

      const newOpportunity = await this.prisma.opportunities.create({ data });

      return newOpportunity;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating the opportunity: ' + error.message,
      );
    }
  }

  async findAll(filters: FilterOpportunityDto) {
    try {
      const formattedFilters: Prisma.OpportunitiesWhereInput =
        this.getFormattedFilters(filters);

      const filteredOpportunities = this.prisma.opportunities.findMany({
        where: formattedFilters,
        select: {
          id: true,
          job: true,
          company: true,
          province: true,
          city: true,
          settings: true,
          link_apply: true,
          image: true,
          salary_range: {
            select: {
              from: true,
              to: true,
            },
          },
        },
      });

      return filteredOpportunities;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching news: ' + error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const opportunity = await this.prisma.opportunities.findFirst({
        where: { id },
      });

      if (!opportunity) {
        throw new NotFoundException(
          `There is no Job Opportunity with ID #${id}`,
        );
      }

      return opportunity;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching job opportunity with ID #${id}:`,
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateOpportunityDto: UpdateOpportunityDto,
    file: Express.Multer.File,
  ) {
    try {
      // Validate Opportunity exist
      const opportunityToUpdate = await this.findOne(id);

      if (!opportunityToUpdate) {
        throw new NotFoundException(`There is no Opportunity with ID #${id}`);
      }

      // Get image link if there is one
      const image = file ? await this.uploadImage(file) : null;

      // Update opportunity information
      const data = {
        job: updateOpportunityDto.job ? updateOpportunityDto.job : undefined,
        company: updateOpportunityDto.company
          ? updateOpportunityDto.company
          : undefined,
        province: updateOpportunityDto.province
          ? updateOpportunityDto.province
          : undefined,
        city: updateOpportunityDto.city ? updateOpportunityDto.city : undefined,
        settings: updateOpportunityDto.settings
          ? updateOpportunityDto.settings
          : undefined,
        link_apply: updateOpportunityDto.link_apply
          ? updateOpportunityDto.link_apply
          : undefined,
        link_post: updateOpportunityDto.link_post
          ? updateOpportunityDto.link_post
          : undefined,
        description: updateOpportunityDto.description
          ? updateOpportunityDto.description
          : undefined,
        updated_at: new Date(),
        image: image ? image.path + '/' + image.fileName : undefined,
        salary_range: updateOpportunityDto.salary_range_id
          ? { connect: { id: updateOpportunityDto.salary_range_id } }
          : undefined,
      };

      const updatedOpportunity = await this.prisma.opportunities.update({
        where: { id },
        data: data,
      });

      return updatedOpportunity;
    } catch (error) {
      console.log('ERROR UPDATE:', error);
      throw new InternalServerErrorException(
        `Error updating opportunity with ID #${id}:`,
        error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      // VALIDATE OPPORTUNITY EXIST
      const opportunityToDelete = await this.findOne(id);
      if (!opportunityToDelete) {
        throw new NotFoundException(
          `There is no Opportunity with ID #${id} to delete`,
        );
      }

      const deletedOpportunity = await this.prisma.opportunities.delete({
        where: { id },
      });

      return deletedOpportunity;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
