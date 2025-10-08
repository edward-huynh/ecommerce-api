import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ status: 201, description: 'Đơn hàng đã được tạo thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'status', required: false, description: 'Trạng thái đơn hàng' })
  findAll(
    @GetUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.ordersService.findAll(user.id, { page, limit, status });
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng (Admin)' })
  @ApiResponse({ status: 200, description: 'Danh sách tất cả đơn hàng' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.ordersService.findAllAdmin({ page, limit, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Thông tin đơn hàng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Trạng thái đơn hàng đã được cập nhật' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa đơn hàng (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được xóa' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}