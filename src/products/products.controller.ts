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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Sản phẩm đã được tạo thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID danh mục' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Giá tối thiểu' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Giá tối đa' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp theo (price, name, createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Thứ tự sắp xếp (asc, desc)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.productsService.findAll({
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm nổi bật' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm nổi bật' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Lấy sản phẩm theo danh mục' })
  @ApiParam({ name: 'categoryId', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm theo danh mục' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Thông tin sản phẩm' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Thông tin sản phẩm' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được cập nhật' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được xóa' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}