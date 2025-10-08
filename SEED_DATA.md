# 🌱 Hướng dẫn Import Dữ liệu Mẫu

## Tổng quan
File này hướng dẫn cách import dữ liệu mẫu vào MongoDB cho dự án E-commerce API.

## Cấu trúc Dữ liệu

### 👥 Users (3 tài khoản)
- **Admin**: admin@example.com / 123456 (Role: ADMIN)
- **User 1**: user1@example.com / 123456 (Role: USER)
- **User 2**: user2@example.com / 123456 (Role: USER)

### 📂 Categories (5 danh mục)
1. Điện thoại & Phụ kiện
2. Laptop & Máy tính
3. Thời trang Nam
4. Thời trang Nữ
5. Gia dụng & Đời sống

### 📱 Products (5 sản phẩm)
1. iPhone 15 Pro Max 256GB - 32,990,000 VNĐ
2. MacBook Air M2 13 inch 256GB - 26,990,000 VNĐ
3. Áo Polo Nam Cao Cấp - 249,000 VNĐ
4. Váy Maxi Nữ Họa Tiết Hoa - 399,000 VNĐ
5. Nồi Cơm Điện Tử 1.8L - 1,190,000 VNĐ

### 🛒 Orders (2 đơn hàng)
- Đơn hàng 1: iPhone 15 Pro Max (Đã giao)
- Đơn hàng 2: Áo Polo + Váy Maxi (Đang xử lý)

### 📝 Posts (3 bài viết)
1. Hướng dẫn chọn mua iPhone phù hợp với nhu cầu
2. Top 10 laptop tốt nhất năm 2024
3. Xu hướng thời trang mùa hè 2024

## Cách sử dụng

### 1. Import dữ liệu mẫu
```bash
# Chạy lệnh seed để import tất cả dữ liệu mẫu
pnpm run seed
```

### 2. Kiểm tra dữ liệu trong MongoDB
Sử dụng MongoDB Compass hoặc MongoDB CLI để kiểm tra:
- Database: `ecommerce_db`
- Collections: `users`, `categories`, `products`, `orders`, `posts`

### 3. Test API với dữ liệu mẫu

#### Đăng nhập
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

#### Lấy danh sách sản phẩm
```bash
GET http://localhost:3000/products
```

#### Lấy danh sách đơn hàng (cần đăng nhập)
```bash
GET http://localhost:3000/orders
Authorization: Bearer <your_token>
```

## Cấu trúc File

### 📁 src/database/
- `seed-data.ts` - Service chứa logic import dữ liệu
- `seed.command.ts` - Command để chạy seed
- `database.module.ts` - Module đăng ký các schema

### 📁 src/schemas/
- `user.schema.ts` - Schema cho User
- `category.schema.ts` - Schema cho Category  
- `product.schema.ts` - Schema cho Product
- `order.schema.ts` - Schema cho Order
- `post.schema.ts` - Schema cho Post

## Lưu ý

1. **Xóa dữ liệu cũ**: Lệnh seed sẽ xóa toàn bộ dữ liệu cũ trước khi import
2. **Mật khẩu mặc định**: Tất cả tài khoản đều có mật khẩu là `123456`
3. **MongoDB Connection**: Đảm bảo MongoDB đang chạy trên `mongodb://localhost:27017`
4. **Environment**: Kiểm tra file `.env` có cấu hình đúng `MONGODB_URI`

## Tùy chỉnh Dữ liệu

Để thêm hoặc sửa dữ liệu mẫu, chỉnh sửa file `src/database/seed-data.ts`:

```typescript
// Thêm user mới
const usersData = [
  // ... existing users
  {
    email: 'newuser@example.com',
    password: hashedPassword,
    firstName: 'New',
    lastName: 'User',
    // ... other fields
  }
];
```

Sau đó chạy lại lệnh seed:
```bash
pnpm run seed
```

## Troubleshooting

### Lỗi kết nối MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp**: Khởi động MongoDB service

### Lỗi duplicate key
```
E11000 duplicate key error
```
**Giải pháp**: Dữ liệu đã tồn tại, lệnh seed sẽ tự động xóa và tạo lại

### Lỗi validation
```
ValidationError: Path `email` is required
```
**Giải pháp**: Kiểm tra lại cấu trúc dữ liệu trong file seed-data.ts