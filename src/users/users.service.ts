import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {} // User.name ở bên file module

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async createUser(createUserDto: CreateUserDto, currentUser: IUser) {
    const { password } = createUserDto;

    const hashPassword = this.getHashPassword(password);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: currentUser._id,
        email: currentUser.email,
      },
    });
    return { _id: user._id, createdAt: user.createdAt };
  }

  async registerUser(registerUser: RegisterUserDto) {
    const { password } = registerUser;

    const hashPassword = this.getHashPassword(password);

    const user = await this.userModel.create({
      ...registerUser,
      role: 'USER',
      password: hashPassword,
    });
    return { _id: user?._id, createdAt: user?.createdAt };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'user not found';
    const result = await this.userModel.findOne({ _id: id });
    // const result2 = await this.userModel
    //   .findOne({ _id: id })
    //   .select(['-password', '-name']); // nếu muốn bỏ field nào thì dùng select kia, bỏ nhiều thì dùng [] còn 1 chỉ cần truyền vào string

    const { password, ...rest } = result.toObject();
    return rest;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'user not found';
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: { _id: currentUser._id, email: currentUser.email },
      },
    );
    return updateUser;
  }

  async remove(id: string, currentUser: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'user not found';

    const result = await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { _id: currentUser._id, email: currentUser.email } },
    );

    if (!result) return 'user not found';
    return this.userModel.softDelete({ _id: id });
  }

  findOnebyUsername(userName: string) {
    return this.userModel.findOne({ email: userName });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
