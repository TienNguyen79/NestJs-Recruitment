import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'isActive phải là kiểu boolean' })
  isActive: boolean;

  @IsArray({ message: 'Permission phải là một mảng' })
  @ArrayNotEmpty({ message: 'Permission không được để trống' })
  @IsMongoId({
    each: true,
    message: 'Mỗi phần tử trong permission phải là ObjectId hợp lệ',
  })
  permissions: mongoose.Schema.Types.ObjectId[];
}
