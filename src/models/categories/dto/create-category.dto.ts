import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @MinLength(3, { message: 'Danh mục phải có ít nhất 3 ký tự' })
  name: string;
}
