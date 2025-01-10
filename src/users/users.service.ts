import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/database/sample';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
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

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const user = await this.userModel.create({
      ...registerUser,
      role: userRole._id,
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
    const result = await this.userModel
      .findOne({ _id: id })
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
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

    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa tài khoản admin@gmail.com');
    }
    const result = await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { _id: currentUser._id, email: currentUser.email } },
    );

    if (!result) return 'user not found';
    return this.userModel.softDelete({ _id: id });
  }

  findOnebyUsername(userName: string) {
    return this.userModel.findOne({ email: userName }).populate({
      path: 'role',
      select: { name: 1 },
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate({
      path: 'role',
      select: { name: 1 },
    });
  };
}
