import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { ResponseMessage } from 'src/common/interceptors/response-message.interceptor';
import { PublicRoute } from 'src/common/decorators/PublicRoute.decorator';
import { IQueriesParams } from '../users/interface/queriesParams.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Tạo mới sản phẩm')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @PublicRoute()
  @Get()
  @ResponseMessage('Danh sách sản phẩm')
  findAll(@Query() queries: IQueriesParams) {
    return this.productService.findAll(queries);
  }

  @PublicRoute()
  @Get(':id')
  @ResponseMessage('Chi tiết sản phẩm')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật sản phẩm')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa sản phẩm')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
