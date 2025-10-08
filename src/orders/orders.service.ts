import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    
    // Tính toán tổng tiền
    const subtotal = createOrderDto.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity - (item.discount || 0));
    }, 0);

    const orderData = {
      ...createOrderDto,
      orderNumber,
      userId,
      subtotal,
      total: subtotal, // Có thể thêm phí ship, thuế sau
    };

    const createdOrder = new this.orderModel(orderData);
    return createdOrder.save();
  }

  async findAll(userId: string, options?: any): Promise<any> {
    const { page = 1, limit = 10, status } = options || {};
    const skip = (page - 1) * limit;

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(options?: any): Promise<any> {
    const { page = 1, limit = 10, status } = options || {};
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (userId) {
      filter.userId = userId;
    }

    const order = await this.orderModel.findOne(filter).exec();
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return { message: 'Xóa đơn hàng thành công' };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }
}