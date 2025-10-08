import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsMongoId, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '../product.schema';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'iPhone 15 Pro Max 256GB',
  })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @ApiPropertyOptional({
    description: 'Slug của sản phẩm (tự động tạo nếu không cung cấp)',
    example: 'iphone-15-pro-max-256gb',
  })
  @IsOptional()
  @IsString({ message: 'Slug phải là chuỗi' })
  slug?: string;

  @ApiProperty({
    description: 'Mô tả chi tiết sản phẩm',
    example: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ...',
  })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn gọn',
    example: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả ngắn phải là chuỗi' })
  shortDescription?: string;

  @ApiProperty({
    description: 'Giá sản phẩm (VNĐ)',
    example: 32990000,
  })
  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price: number;

  @ApiProperty({
    description: 'Số lượng tồn kho',
    example: 100,
  })
  @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
  @Min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' })
  stock: number;

  @ApiPropertyOptional({
    description: 'Danh sách URL hình ảnh',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  })
  @IsOptional()
  @IsArray({ message: 'Hình ảnh phải là mảng' })
  @IsString({ each: true, message: 'Mỗi URL hình ảnh phải là chuỗi' })
  images?: string[];

  @ApiProperty({
    description: 'ID danh mục',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId({ message: 'ID danh mục không hợp lệ' })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Trạng thái sản phẩm',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Trạng thái sản phẩm không hợp lệ' })
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'SKU sản phẩm',
    example: 'IP15PM256-TN',
  })
  @IsOptional()
  @IsString({ message: 'SKU phải là chuỗi' })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Cân nặng (gram)',
    example: 221,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Cân nặng phải là số' })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Kích thước (dài x rộng x cao) cm',
    example: '15.9 x 7.6 x 0.8',
  })
  @IsOptional()
  @IsString({ message: 'Kích thước phải là chuỗi' })
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Thẻ tag',
    example: ['smartphone', 'apple', 'premium'],
  })
  @IsOptional()
  @IsArray({ message: 'Tags phải là mảng' })
  @IsString({ each: true, message: 'Mỗi tag phải là chuỗi' })
  tags?: string[];
}