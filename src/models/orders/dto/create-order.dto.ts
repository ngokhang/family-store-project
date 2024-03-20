import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class IProductOrders {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => IProductOrders)
  productOrder: IProductOrders[];
}
