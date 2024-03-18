import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseMessage } from 'src/common/interceptors/response-message.interceptor';
import { PublicRoute } from 'src/common/decorators/PublicRoute.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage('Tạo mới danh mục')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @PublicRoute()
  @Get()
  @ResponseMessage('Danh sách danh mục')
  findAll(@Query() queries: any) {
    return this.categoriesService.findAll(queries);
  }

  @PublicRoute()
  @Get(':id')
  @ResponseMessage('Chi tiết danh mục')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật danh mục')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa danh mục')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
