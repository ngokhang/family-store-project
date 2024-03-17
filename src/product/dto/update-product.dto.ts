import { OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductDto extends OmitType(CreateProductDto, [
  'categories' as const,
]) {
  @IsOptional()
  deletedAt?: Date;
}
