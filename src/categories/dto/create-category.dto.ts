import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại & Phụ kiện',
  })
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiPropertyOptional({
    description: 'Slug của danh mục (tự động tạo nếu không cung cấp)',
    example: 'dien-thoai-phu-kien',
  })
  @IsOptional()
  @IsString({ message: 'Slug phải là chuỗi' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Mô tả danh mục',
    example: 'Các sản phẩm điện thoại và phụ kiện công nghệ',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh danh mục',
    example: 'https://example.com/category-image.jpg',
  })
  @IsOptional()
  @IsString({ message: 'URL hình ảnh phải là chuỗi' })
  image?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục cha',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId({ message: 'ID danh mục cha không hợp lệ' })
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Thứ tự sắp xếp phải là số' })
  sortOrder?: number;
}