import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { CompaniesService } from 'src/companies/companies.service';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly companyService: CompaniesService,
  ) {}

  @Post()
  @ResponseMessage('Create a new Job')
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    const isValidCompany = await this.companyService.findCompanyById(
      String(createJobDto.company._id),
    );

    if (!isValidCompany) {
      throw new BadRequestException('Company không tồn tại !');
    }

    return this.jobsService.createJob(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Get all Job')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Get a job')
  findOne(@Param('id') id: string) {
    return this.jobsService.findJobById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Job')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    const isValidJob = await this.jobsService.findJobById(id);
    if (!isValidJob) {
      throw new BadRequestException('Job không tồn tại !');
    }
    return this.jobsService.updateJob(id, updateJobDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.removeJob(id, user);
  }
}
