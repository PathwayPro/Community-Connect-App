import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalaryRangesService } from './salary_ranges.service';
import { CreateSalaryRangeDto } from './dto/create-salary-ranges.dto';
import { UpdateSalaryRangeDto } from './dto/update-salary-ranges.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Salary Ranges')
@Controller('salary-ranges')
export class SalaryRangesController {
  constructor(private readonly salaryRangesService: SalaryRangesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new salary range' })
  @ApiResponse({
    status: 201,
    description: 'Salary range created successfully',
  })
  create(@Body() createSalaryRangeDto: CreateSalaryRangeDto) {
    return this.salaryRangesService.create(createSalaryRangeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all salary ranges' })
  @ApiResponse({ status: 200, description: 'Return all salary ranges' })
  findAll() {
    return this.salaryRangesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a salary range by id' })
  @ApiResponse({ status: 200, description: 'Return a salary range' })
  findOne(@Param('id') id: string) {
    return this.salaryRangesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a salary range' })
  @ApiResponse({
    status: 200,
    description: 'Salary range updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateSalaryRangeDto: UpdateSalaryRangeDto,
  ) {
    return this.salaryRangesService.update(+id, updateSalaryRangeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a salary range' })
  @ApiResponse({
    status: 200,
    description: 'Salary range deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.salaryRangesService.remove(+id);
  }
}
