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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiResponse({ status: 201, description: 'Danh mục đã được tạo thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên' })
  @ApiQuery({ name: 'parentId', required: false, description: 'ID danh mục cha' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.categoriesService.findAll({ page, limit, search, parentId });
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách danh mục đang hoạt động' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục hoạt động' })
  findActive() {
    return this.categoriesService.findActive();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Lấy cây danh mục phân cấp' })
  @ApiResponse({ status: 200, description: 'Cây danh mục' })
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Thông tin danh mục' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của danh mục' })
  @ApiResponse({ status: 200, description: 'Thông tin danh mục' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Lấy danh sách danh mục con' })
  @ApiParam({ name: 'id', description: 'ID của danh mục cha' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục con' })
  getChildren(@Param('id') id: string) {
    return this.categoriesService.getChildren(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Danh mục đã được cập nhật' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Danh mục đã được xóa' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}