import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Skills không được để trống' })
  @IsArray({ message: 'Skills phải là một mảng' })
  @IsString({ each: true, message: 'Mỗi kỹ năng trong skills phải là chuỗi' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Salary không được để trống' })
  salary: number;

  @IsNotEmpty({ message: 'Quantity không được để trống' })
  @Type(() => Number) // Tự động chuyển đổi từ chuỗi thành số
  @IsInt({ message: 'Quantity phải là một số nguyên' }) // Nếu chỉ chấp nhận số nguyên
  quantity: number;

  @IsNotEmpty({ message: 'Level không được để trống' })
  level: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'startDate không được để trống' })
  @Type(() => Date) // Tự động chuyển đổi chuỗi thành Date
  @IsDate({ message: 'StartDate phải là một ngày hợp lệ' })
  startDate: string;

  @IsNotEmpty({ message: 'endDate không được để trống' })
  @Type(() => Date) // Tự động chuyển đổi chuỗi thành Date
  @IsDate({ message: 'endDate phải là một ngày hợp lệ' })
  endDate: string;

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'isActive phải là kiểu boolean' })
  isActive: boolean;
}
