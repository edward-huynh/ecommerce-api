import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../order.schema';

class OrderItemDto {
  @ApiProperty({ description: 'ID sản phẩm' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Số lượng' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Giá' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Giảm giá' })
  @IsOptional()
  @IsNumber()
  discount?: number;
}

class ShippingAddressDto {
  @ApiProperty({ description: 'Họ tên' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Địa chỉ' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Thành phố' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Danh sách sản phẩm', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Địa chỉ giao hàng', type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ description: 'Phương thức thanh toán', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: 'Ghi chú đơn hàng' })
  @IsOptional()
  @IsString()
  notes?: string;
}