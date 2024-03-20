import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}
