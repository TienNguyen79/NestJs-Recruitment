import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Request } from 'express';
import mongoose from 'mongoose';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Company with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Get a Company')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found company with id = ${id}`);
    }
    return this.companiesService.findCompanyById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
