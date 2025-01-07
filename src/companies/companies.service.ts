import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const createCompany = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return createCompany;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'company not found';
    const updateUser = await this.companyModel.updateOne(
      { _id: id },
      { ...updateCompanyDto, updatedBy: { _id: user._id, email: user.email } },
    );
    return updateUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    // if (filter.name) {
    //   filter.name = { $regex: filter.name, $options: 'i' }; // Không phân biệt chữ hoa/thường
    // }

    // if (filter.address) {
    //   filter.address = { $regex: filter.address, $options: 'i' }; // Không phân biệt chữ hoa/thường
    // }

    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const sortCondition = sort || { createdAt: -1 }; // mặc định sort theo thời gian mới nhất

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sortCondition as any)
      .populate(population) // để tham chiếu và lấy thông tin chi tiết từ các tài liệu liên kết trong cơ sở dữ liệu.
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

  async findCompanyById(id: string) {
    return await this.companyModel.findOne({ _id: id });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'company not found';

    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      },
    );

    return this.companyModel.softDelete({
      _id: id,
    });
  }
}
