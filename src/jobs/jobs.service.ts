import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { Company, CompanyDocument } from 'src/companies/schema/company.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async createJob(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return { _id: job._id, createdAt: job.createdAt };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    console.log('🚀 ~ JobsService ~ findAll ~ filter:', filter);

    delete filter.current;
    delete filter.pageSize;

    if (filter.name && typeof filter.name != 'object') {
      // filter.name != 'object' tránh trường hợp nhập rỗng thì lỗi
      filter.name = { $regex: filter.name, $options: 'i' }; // Không phân biệt chữ hoa/thường
    }

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      result,
      meta: {
        current: currentPage || 1,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
    };
  }

  async findJobById(id: string) {
    return await this.jobModel.findOne({ _id: id });
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updateUser = await this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updateUser;
  }

  async removeJob(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'job not found';

    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      },
    );

    return this.jobModel.softDelete({
      _id: id,
    });
  }
}
