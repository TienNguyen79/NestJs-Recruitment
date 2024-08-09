import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

//PartialType kế thừa CreateUserDto, OmitType : muốn bỏ  đi trường nào đó ví dụ như password
// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
