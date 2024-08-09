import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty } from 'class-validator';

// export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
export class UpdateCompanyDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;
}
