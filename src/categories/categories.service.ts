import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { checkExisted, paginationList } from 'src/utils';
import { metadataResponseFetch } from 'src/constants';
import { IQueriesParams } from 'src/users/interface/queriesParams.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const params = {
      key: 'name',
      value: createCategoryDto.name,
    };
    const categoryExists = await checkExisted(this.categoryRepository, params);

    if (!categoryExists) {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    }

    throw new BadRequestException('Danh mục đã tòn tại');
  }

  async findAll(queries: IQueriesParams) {
    const { page, pageSize } = queries;
    const categoriesList = await paginationList(
      this.categoryRepository,
      'categories',
      queries,
    )
      .orderBy('categories.createdAt', 'ASC')
      .getManyAndCount();
    const totalPages = Math.ceil(categoriesList[1] / pageSize);

    return {
      metadata: metadataResponseFetch(
        page,
        pageSize,
        categoriesList[1],
        totalPages,
      ),
      result: categoriesList[0],
    };
  }

  async findOne(id: string) {
    const categoryExisted = await checkExisted(this.categoryRepository, {
      key: 'id',
      value: id,
    });

    if (categoryExisted) {
      return categoryExisted;
    }
    throw new BadRequestException('Danh mục không tồn tại');
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryExisted = await checkExisted(this.categoryRepository, {
      key: 'id',
      value: id,
    });

    if (!categoryExisted)
      throw new BadRequestException('Danh mục không tồn tại');

    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const categoryExisted = await checkExisted(this.categoryRepository, {
      key: 'id',
      value: id,
    });

    if (!categoryExisted)
      throw new BadRequestException('Danh mục không tồn tại');

    return await this.categoryRepository.softDelete(id);
  }
}
