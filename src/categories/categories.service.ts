import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Tạo slug tự động nếu không có
    if (!createCategoryDto.slug) {
      createCategoryDto.slug = this.generateSlug(createCategoryDto.name);
    }

    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await this.categoryModel.findOne({
      slug: createCategoryDto.slug,
    });
    if (existingCategory) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string;
  }): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, parentId } = options || {};
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (parentId) {
      filter.parentId = parentId;
    }

    const [data, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActive(): Promise<Category[]> {
    return this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async getCategoryTree(): Promise<Category[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();

    return this.buildCategoryTree(categories);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async getChildren(parentId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ parentId, isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Nếu có slug mới, kiểm tra trùng lặp
    if (updateCategoryDto.slug) {
      const existingCategory = await this.categoryModel.findOne({
        slug: updateCategoryDto.slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    // Kiểm tra có danh mục con không
    const children = await this.categoryModel.find({ parentId: id });
    if (children.length > 0) {
      throw new BadRequestException('Không thể xóa danh mục có danh mục con');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return { message: 'Xóa danh mục thành công' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  private buildCategoryTree(categories: any[], parentId?: string): any[] {
    const children = categories.filter(cat => 
      parentId ? cat.parentId?.toString() === parentId : !cat.parentId
    );

    return children.map(category => ({
      ...category.toObject(),
      children: this.buildCategoryTree(categories, category._id.toString()),
    }));
  }
}