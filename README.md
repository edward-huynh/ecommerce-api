# 🛒 Ecommerce API - NestJS

Một hệ thống API ecommerce hoàn chỉnh được xây dựng bằng NestJS, Mongoose và MongoDB. Dự án cung cấp các tính năng cơ bản cho một hệ thống thương mại điện tử bao gồm quản lý người dùng, sản phẩm, đơn hàng, danh mục và blog.

## 🚀 Tính năng

### ✅ Đã hoàn thành

#### 🔐 Authentication & Authorization
- ✅ Đăng ký tài khoản với xác thực email
- ✅ Đăng nhập với JWT Token
- ✅ Refresh token
- ✅ Phân quyền theo role (Admin, Moderator, User)
- ✅ Guards bảo vệ routes

#### 👥 Quản lý người dùng
- ✅ Profile management (xem/cập nhật thông tin cá nhân)
- ✅ Quản lý users cho Admin (CRUD, cập nhật role/status)
- ✅ Phân quyền chi tiết theo role

#### 📂 Quản lý danh mục
- ✅ CRUD danh mục sản phẩm
- ✅ Hỗ trợ danh mục cha - con (nested categories)
- ✅ Slug-based URLs
- ✅ Tìm kiếm và phân trang

#### 🛍️ Quản lý sản phẩm
- ✅ CRUD sản phẩm hoàn chỉnh
- ✅ Quản lý kho (stock)
- ✅ Hình ảnh sản phẩm (multiple images)
- ✅ Đánh giá và rating
- ✅ SEO metadata
- ✅ Phân loại theo danh mục

#### 🛒 Quản lý đơn hàng
- ✅ Tạo đơn hàng với nhiều sản phẩm
- ✅ Quản lý trạng thái đơn hàng (pending, confirmed, processing, shipped, delivered, cancelled)
- ✅ Quản lý thanh toán (pending, paid, failed, refunded)
- ✅ Địa chỉ giao hàng chi tiết
- ✅ Lịch sử đơn hàng cho user
- ✅ Quản lý đơn hàng cho Admin

#### 📝 Blog & Posts
- ✅ CRUD bài viết
- ✅ Phân loại bài viết (article, news, tutorial, review)
- ✅ Trạng thái bài viết (draft, published, archived)
- ✅ SEO metadata
- ✅ Tags và categories
- ✅ View count và engagement metrics

#### 🗄️ Database & Seeding
- ✅ MongoDB với Mongoose ODM
- ✅ Dữ liệu mẫu hoàn chỉnh (users, categories, products, orders, posts)
- ✅ Seed command để import dữ liệu test

#### 📚 Documentation
- ✅ Swagger/OpenAPI documentation
- ✅ API endpoints được document đầy đủ
- ✅ Authentication với Bearer token

## 🛠️ Công nghệ sử dụng

- **Framework**: NestJS 11.x
- **Database**: MongoDB
- **ODM**: Mongoose 8.x
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Package Manager**: pnpm
- **Language**: TypeScript 5.x

## 📋 Yêu cầu hệ thống

- Node.js >= 18
- MongoDB >= 5.0
- pnpm

## ⚡ Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd ecommerce-api
```

### 2. Cài đặt dependencies
```bash
pnpm install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=8080
NODE_ENV=development
```

### 4. Khởi động MongoDB
Đảm bảo MongoDB đang chạy trên máy của bạn:

```bash
# macOS với Homebrew
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Import dữ liệu mẫu (tùy chọn)
```bash
pnpm run seed
```

### 6. Chạy ứng dụng
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## 📚 API Documentation

Sau khi chạy ứng dụng, truy cập Swagger documentation tại:
```
http://localhost:8080/api
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/verify-email` - Xác thực email
- `GET /auth/profile` - Lấy thông tin profile
- `POST /auth/refresh` - Làm mới token

### Users
- `GET /users/profile` - Profile của user hiện tại
- `PUT /users/profile` - Cập nhật profile
- `GET /users` - Danh sách users (Admin)
- `GET /users/:id` - Thông tin user theo ID (Admin)
- `PUT /users/:id/role` - Cập nhật role (Admin)
- `PUT /users/:id/status` - Cập nhật status (Admin)

### Categories
- `GET /categories` - Danh sách tất cả danh mục
- `GET /categories/parents` - Danh mục cha
- `GET /categories/:id` - Thông tin danh mục theo ID
- `GET /categories/slug/:slug` - Thông tin danh mục theo slug
- `GET /categories/:id/children` - Danh mục con
- `POST /categories` - Tạo danh mục (Admin/Moderator)
- `PUT /categories/:id` - Cập nhật danh mục (Admin/Moderator)
- `DELETE /categories/:id` - Xóa danh mục (Admin)

### Products
- `GET /products` - Danh sách sản phẩm (có phân trang)
- `GET /products/:id` - Thông tin sản phẩm theo ID
- `GET /products/slug/:slug` - Thông tin sản phẩm theo slug
- `GET /products/category/:categoryId` - Sản phẩm theo danh mục
- `POST /products` - Tạo sản phẩm (Admin/Moderator)
- `PUT /products/:id` - Cập nhật sản phẩm (Admin/Moderator)
- `DELETE /products/:id` - Xóa sản phẩm (Admin)

### Orders
- `POST /orders` - Tạo đơn hàng
- `GET /orders` - Danh sách đơn hàng của user
- `GET /orders/admin` - Tất cả đơn hàng (Admin)
- `GET /orders/:id` - Chi tiết đơn hàng
- `PATCH /orders/:id/status` - Cập nhật trạng thái (Admin)
- `DELETE /orders/:id` - Xóa đơn hàng (Admin)

### Posts
- `GET /posts` - Danh sách bài viết
- `GET /posts/published` - Bài viết đã xuất bản
- `GET /posts/featured` - Bài viết nổi bật
- `GET /posts/:id` - Chi tiết bài viết
- `GET /posts/slug/:slug` - Bài viết theo slug
- `POST /posts` - Tạo bài viết (Admin/Moderator)
- `PUT /posts/:id` - Cập nhật bài viết (Admin/Moderator)
- `DELETE /posts/:id` - Xóa bài viết (Admin)

## 🗂️ Cấu trúc thư mục

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── strategies/      # Passport strategies (JWT)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── user.schema.ts   # User schema & enums
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── categories/          # Categories module
│   ├── dto/            # Create/Update DTOs
│   ├── category.schema.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── products/            # Products module
│   ├── dto/            # Product DTOs
│   ├── product.schema.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/              # Orders module
│   ├── dto/            # Order DTOs
│   ├── order.schema.ts # Order, OrderItem, ShippingAddress schemas
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── posts/               # Posts/Blog module
│   ├── dto/            # Post DTOs
│   ├── post.schema.ts  # Post schema với SEO
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
├── common/              # Shared utilities
│   ├── guards/         # JWT & Roles guards
│   ├── decorators/     # Custom decorators
│   └── dto/           # Common DTOs
├── config/              # Configuration files
│   ├── database.config.ts
│   └── jwt.config.ts
├── database/            # Database & seeding
│   ├── database.module.ts
│   ├── seed-data.ts    # Seed service
│   └── seed.command.ts # Seed command
└── main.ts             # Application entry point
```

## 🔒 Phân quyền

### Roles
- **ADMIN**: Toàn quyền truy cập (CRUD tất cả resources)
- **MODERATOR**: Quản lý sản phẩm, danh mục, bài viết
- **USER**: Người dùng thông thường (xem sản phẩm, tạo đơn hàng)

### Guards
- `JwtAuthGuard`: Xác thực JWT token
- `RolesGuard`: Kiểm tra quyền truy cập theo role

### Decorators
- `@Roles(UserRole.ADMIN)`: Chỉ định roles được phép truy cập
- `@CurrentUser()`: Lấy thông tin user hiện tại
- `@GetUser()`: Lấy user từ request

## 🌱 Dữ liệu mẫu

Dự án bao gồm dữ liệu mẫu hoàn chỉnh:

### 👥 Users (3 tài khoản)
- **Admin**: admin@example.com / 123456
- **User 1**: user1@example.com / 123456  
- **User 2**: user2@example.com / 123456

### 📂 Categories (5 danh mục)
- Điện thoại & Phụ kiện
- Laptop & Máy tính
- Thời trang Nam
- Thời trang Nữ
- Gia dụng & Đời sống

### 📱 Products (5 sản phẩm)
- iPhone 15 Pro Max 256GB
- MacBook Air M2 13 inch 256GB
- Áo Polo Nam Cao Cấp
- Váy Maxi Nữ Họa Tiết Hoa
- Nồi Cơm Điện Tử 1.8L

### 🛒 Orders (2 đơn hàng mẫu)
### 📝 Posts (3 bài viết)

Chi tiết xem file [SEED_DATA.md](./SEED_DATA.md)

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Test watch mode
pnpm run test:watch
```

## 🚀 Deployment

### Build cho production
```bash
pnpm run build
```

### Chạy production
```bash
pnpm run start:prod
```

### Docker (tùy chọn)
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 📝 Scripts có sẵn

- `pnpm run start` - Chạy ứng dụng
- `pnpm run start:dev` - Chạy development mode với watch
- `pnpm run start:debug` - Chạy debug mode
- `pnpm run build` - Build cho production
- `pnpm run seed` - Import dữ liệu mẫu
- `pnpm run lint` - Chạy ESLint
- `pnpm run format` - Format code với Prettier

## 🔧 Cấu hình

### Environment Variables
Xem file `.env.example` để biết tất cả biến môi trường có thể cấu hình.

### Database
- Sử dụng MongoDB với Mongoose
- Hỗ trợ connection string đầy đủ
- Auto-indexing và validation

### JWT
- Configurable secret và expiration
- Refresh token support
- Role-based authorization

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:
1. Kiểm tra [Issues](../../issues) hiện có
2. Tạo issue mới với mô tả chi tiết
3. Tham khảo documentation tại `/api` endpoint

## 🎯 Roadmap

### Tính năng sắp tới
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email service (verification, notifications)
- [ ] File upload service (images, documents)
- [ ] Real-time notifications (WebSocket)
- [ ] Caching với Redis
- [ ] Rate limiting
- [ ] Advanced search & filtering
- [ ] Inventory management
- [ ] Discount & coupon system
- [ ] Review & rating system
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Mobile API optimization

### Cải tiến kỹ thuật
- [ ] Microservices architecture
- [ ] Event-driven architecture
- [ ] Advanced logging & monitoring
- [ ] Performance optimization
- [ ] Security enhancements
- [ ] API versioning
- [ ] GraphQL support
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Load testing
