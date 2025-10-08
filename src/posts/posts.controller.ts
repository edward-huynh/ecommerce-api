import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiResponse({ status: 201, description: 'Tạo bài viết thành công' })
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: any) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng bài viết mỗi trang' })
  @ApiQuery({ name: 'status', required: false, description: 'Trạng thái bài viết' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID danh mục' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách bài viết thành công' })
  findAll(@Query() query: any) {
    return this.postsService.findAll(query);
  }

  @Get('published')
  @ApiOperation({ summary: 'Lấy danh sách bài viết đã xuất bản' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng bài viết mỗi trang' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách bài viết đã xuất bản thành công' })
  findPublished(@Query() query: any) {
    return this.postsService.findPublished(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách bài viết nổi bật' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách bài viết nổi bật thành công' })
  findFeatured() {
    return this.postsService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy bài viết theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy bài viết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy bài viết theo slug' })
  @ApiResponse({ status: 200, description: 'Lấy bài viết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiResponse({ status: 200, description: 'Cập nhật bài viết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài viết' })
  @ApiResponse({ status: 200, description: 'Xóa bài viết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}