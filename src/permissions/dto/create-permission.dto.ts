import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'apiPath không được để trống' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method không được để trống' })
  method: boolean;

  @IsNotEmpty({ message: 'Module không được để trống' })
  module: boolean;
}
