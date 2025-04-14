import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSalaryRangeDto } from './dto/create-salary-ranges.dto';
import { UpdateSalaryRangeDto } from './dto/update-salary-ranges.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalaryRangesService {
  constructor(private prisma: PrismaService) {}

  private handlePrismaError(error: any, id?: number | string) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(
            'A salary range with this range already exists',
          );
        case 'P2025':
          throw new NotFoundException(
            `Salary range ${id ? `with ID ${id}` : ''} not found`,
          );
        default:
          throw error;
      }
    }
    throw error;
  }

  private validateSalaryRange(from: number, to: number) {
    if (from >= to) {
      throw new BadRequestException(
        'The "from" value must be less than the "to" value',
      );
    }
    if (from < 0 || to < 0) {
      throw new BadRequestException('Salary values cannot be negative');
    }
  }

  async create(createSalaryRangeDto: CreateSalaryRangeDto) {
    const { from, to } = createSalaryRangeDto;
    this.validateSalaryRange(from, to);

    try {
      return await this.prisma.salaryRanges.create({
        data: createSalaryRangeDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.salaryRanges.findMany({
      orderBy: { from: 'asc' },
    });
  }

  async findOne(id: number) {
    try {
      const salaryRange = await this.prisma.salaryRanges.findUniqueOrThrow({
        where: { id },
      });
      return salaryRange;
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async update(id: number, updateSalaryRangeDto: UpdateSalaryRangeDto) {
    if (updateSalaryRangeDto.from && updateSalaryRangeDto.to) {
      this.validateSalaryRange(
        updateSalaryRangeDto.from,
        updateSalaryRangeDto.to,
      );
    }

    try {
      return await this.prisma.salaryRanges.update({
        where: { id },
        data: updateSalaryRangeDto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salaryRanges.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }
}
