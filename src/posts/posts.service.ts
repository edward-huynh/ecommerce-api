import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    // Tạo slug tự động nếu không có
    if (!createPostDto.slug) {
      createPostDto.slug = this.generateSlug(createPostDto.title);
    }

    const createdPost = new this.postModel({
      ...createPostDto,
      authorId,
    });
    return createdPost.save();
  }

  async findAll(options?: any): Promise<any> {
    const { page = 1, limit = 10, status, categoryId } = options || {};
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const [data, total] = await Promise.all([
      this.postModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublished(options?: any): Promise<any> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.postModel
        .find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments({ status: 'published' }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeatured(): Promise<Post[]> {
    return this.postModel
      .find({ status: 'published', isFeatured: true })
      .sort({ publishedAt: -1 })
      .limit(10)
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Tăng view count
    post.viewCount = (post.viewCount || 0) + 1;
    await post.save();

    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postModel.findOne({ slug }).exec();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Tăng view count
    post.viewCount = (post.viewCount || 0) + 1;
    await post.save();

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    return updatedPost;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    return { message: 'Xóa bài viết thành công' };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
}