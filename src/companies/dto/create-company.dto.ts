import { IsNotEmpty } from 'class-validator';

// dto: data transfer object
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;
}
