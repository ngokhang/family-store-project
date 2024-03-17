import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { CustomNumberValidator } from 'src/decorators/Validation.decorator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Vui lòng nhập tên sản phẩm' })
  productName: string;

  @IsNotEmpty({ message: 'Vui lòng nhập giá nhập hàng' })
  @Validate(CustomNumberValidator, { message: 'Giá nhập hàng không hợp lệ' })
  inputPrice: number;

  @IsNotEmpty({ message: 'Vui lòng nhập giá bán ra' })
  @Validate(CustomNumberValidator, { message: 'Giá bán không hợp lệ' })
  price: number;

  description: string;

  @IsNotEmpty({ message: 'Vui lòng nhập số lượng' })
  @Validate(CustomNumberValidator, { message: 'Số lượng không hợp lệ' })
  quantity: number;

  @IsNotEmpty({ message: 'Vui lòng nhập danh mục' })
  @IsUUID('4', { each: true, message: 'Danh mục không hợp lệ' })
  categories: string[];
}
