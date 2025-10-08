import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus } from '../users/user.schema';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Product, ProductDocument, ProductStatus } from '../products/product.schema';
import { Order, OrderDocument, OrderStatus, PaymentStatus, PaymentMethod } from '../orders/order.schema';
import { Post, PostDocument, PostStatus, PostType } from '../posts/post.schema';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async seedAll() {
    console.log('🌱 Bắt đầu import dữ liệu mẫu...');
    
    // Xóa dữ liệu cũ
    await this.clearData();
    
    // Import dữ liệu mới
    const users = await this.seedUsers();
    const categories = await this.seedCategories();
    const products = await this.seedProducts(categories);
    await this.seedOrders(users, products);
    await this.seedPosts(users);
    
    console.log('✅ Import dữ liệu mẫu hoàn tất!');
  }

  private async clearData() {
    console.log('🗑️ Xóa dữ liệu cũ...');
    await Promise.all([
      this.userModel.deleteMany({}),
      this.categoryModel.deleteMany({}),
      this.productModel.deleteMany({}),
      this.orderModel.deleteMany({}),
      this.postModel.deleteMany({}),
    ]);
  }

  private async seedUsers(): Promise<UserDocument[]> {
    console.log('👥 Import users...');
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const usersData = [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        phone: '0123456789',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      },
      {
        email: 'user1@example.com',
        password: hashedPassword,
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        phone: '0987654321',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      },
      {
        email: 'user2@example.com',
        password: hashedPassword,
        firstName: 'Trần',
        lastName: 'Thị B',
        phone: '0912345678',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      },
    ];

    const users = await this.userModel.insertMany(usersData);
    console.log(`✅ Đã tạo ${users.length} users`);
    return users;
  }

  private async seedCategories(): Promise<CategoryDocument[]> {
    console.log('📂 Import categories...');
    
    const categoriesData = [
      {
        name: 'Điện thoại & Phụ kiện',
        slug: 'dien-thoai-phu-kien',
        description: 'Điện thoại thông minh và phụ kiện',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Laptop & Máy tính',
        slug: 'laptop-may-tinh',
        description: 'Laptop, máy tính để bàn và linh kiện',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Thời trang Nam',
        slug: 'thoi-trang-nam',
        description: 'Quần áo, giày dép thời trang nam',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Thời trang Nữ',
        slug: 'thoi-trang-nu',
        description: 'Quần áo, giày dép thời trang nữ',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Gia dụng & Đời sống',
        slug: 'gia-dung-doi-song',
        description: 'Đồ gia dụng và vật dụng sinh hoạt',
        isActive: true,
        sortOrder: 5,
      },
    ];

    const categories = await this.categoryModel.insertMany(categoriesData);
    console.log(`✅ Đã tạo ${categories.length} categories`);
    return categories;
  }

  private async seedProducts(categories: CategoryDocument[]): Promise<any[]> {
    console.log('📱 Import products...');
    
    const productsData = [
      {
        name: 'iPhone 15 Pro Max 256GB',
        slug: 'iphone-15-pro-max-256gb',
        description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp',
        shortDescription: 'iPhone 15 Pro Max - Đỉnh cao công nghệ',
        price: 34990000,
        salePrice: 32990000,
        stock: 50,
        sku: 'IP15PM256',
        images: [
          'https://example.com/iphone15-1.jpg',
          'https://example.com/iphone15-2.jpg'
        ],
        categoryId: categories[0]._id,
        status: ProductStatus.ACTIVE,
        rating: 4.8,
        reviewCount: 125,
        tags: ['iPhone', 'Apple', 'Smartphone'],
      },
      {
        name: 'MacBook Air M2 13 inch 256GB',
        slug: 'macbook-air-m2-13-256gb',
        description: 'MacBook Air M2 với thiết kế mỏng nhẹ, hiệu năng vượt trội',
        shortDescription: 'MacBook Air M2 - Mỏng nhẹ, mạnh mẽ',
        price: 28990000,
        salePrice: 26990000,
        stock: 30,
        sku: 'MBA13M2256',
        images: [
          'https://example.com/macbook-air-1.jpg',
          'https://example.com/macbook-air-2.jpg'
        ],
        categoryId: categories[1]._id,
        status: ProductStatus.ACTIVE,
        rating: 4.7,
        reviewCount: 89,
        tags: ['MacBook', 'Apple', 'Laptop'],
      },
      {
        name: 'Áo Polo Nam Cao Cấp',
        slug: 'ao-polo-nam-cao-cap',
        description: 'Áo polo nam chất liệu cotton cao cấp, form dáng chuẩn',
        shortDescription: 'Áo polo nam cotton cao cấp',
        price: 299000,
        salePrice: 249000,
        stock: 100,
        sku: 'POLO001',
        images: [
          'https://example.com/polo-1.jpg',
          'https://example.com/polo-2.jpg'
        ],
        categoryId: categories[2]._id,
        status: ProductStatus.ACTIVE,
        rating: 4.5,
        reviewCount: 45,
        tags: ['Polo', 'Nam', 'Cotton'],
      },
      {
        name: 'Váy Maxi Nữ Họa Tiết Hoa',
        slug: 'vay-maxi-nu-hoa-tiet-hoa',
        description: 'Váy maxi nữ họa tiết hoa xinh xắn, chất liệu voan mềm mại',
        shortDescription: 'Váy maxi họa tiết hoa xinh xắn',
        price: 450000,
        salePrice: 399000,
        stock: 75,
        sku: 'MAXI001',
        images: [
          'https://example.com/maxi-1.jpg',
          'https://example.com/maxi-2.jpg'
        ],
        categoryId: categories[3]._id,
        status: ProductStatus.ACTIVE,
        rating: 4.6,
        reviewCount: 67,
        tags: ['Váy', 'Nữ', 'Maxi', 'Hoa'],
      },
      {
        name: 'Nồi Cơm Điện Tử 1.8L',
        slug: 'noi-com-dien-tu-1-8l',
        description: 'Nồi cơm điện tử thông minh, dung tích 1.8L phù hợp gia đình 4-6 người',
        shortDescription: 'Nồi cơm điện tử thông minh 1.8L',
        price: 1290000,
        salePrice: 1190000,
        stock: 40,
        sku: 'RICE18',
        images: [
          'https://example.com/rice-cooker-1.jpg',
          'https://example.com/rice-cooker-2.jpg'
        ],
        categoryId: categories[4]._id,
        status: ProductStatus.ACTIVE,
        rating: 4.4,
        reviewCount: 32,
        tags: ['Nồi cơm', 'Gia dụng', 'Điện tử'],
      },
    ];

    const products = await this.productModel.insertMany(productsData);
    console.log(`✅ Đã tạo ${products.length} products`);
    return products;
  }

  private async seedOrders(users: UserDocument[], products: any[]) {
    console.log('🛒 Import orders...');
    
    const ordersData = [
      {
        orderNumber: 'ORD001',
        userId: users[1]._id,
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            quantity: 1,
            price: products[0].salePrice || products[0].price,
            discount: 0,
            total: products[0].salePrice || products[0].price,
          }
        ],
        subtotal: products[0].salePrice || products[0].price,
        discount: 0,
        shippingFee: 30000,
        tax: 0,
        total: (products[0].salePrice || products[0].price) + 30000,
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        shippingAddress: {
          fullName: 'Nguyễn Văn A',
          phone: '0987654321',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          ward: 'Phường 1',
          district: 'Quận 1',
          city: 'TP.HCM',
        },
        deliveredAt: new Date(),
      },
      {
        orderNumber: 'ORD002',
        userId: users[2]._id,
        items: [
          {
            productId: products[2]._id,
            productName: products[2].name,
            quantity: 2,
            price: products[2].salePrice || products[2].price,
            discount: 0,
            total: (products[2].salePrice || products[2].price) * 2,
          },
          {
            productId: products[3]._id,
            productName: products[3].name,
            quantity: 1,
            price: products[3].salePrice || products[3].price,
            discount: 0,
            total: products[3].salePrice || products[3].price,
          }
        ],
        subtotal: ((products[2].salePrice || products[2].price) * 2) + (products[3].salePrice || products[3].price),
        discount: 50000,
        shippingFee: 25000,
        tax: 0,
        total: ((products[2].salePrice || products[2].price) * 2) + (products[3].salePrice || products[3].price) - 50000 + 25000,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        shippingAddress: {
          fullName: 'Trần Thị B',
          phone: '0912345678',
          address: '456 Đường XYZ, Quận 2, TP.HCM',
          ward: 'Phường 2',
          district: 'Quận 2',
          city: 'TP.HCM',
        },
      },
    ];

    const orders = await this.orderModel.insertMany(ordersData);
    console.log(`✅ Đã tạo ${orders.length} orders`);
  }

  private async seedPosts(users: UserDocument[]) {
    console.log('📝 Import posts...');
    
    const postsData = [
      {
        title: 'Hướng dẫn chọn mua iPhone phù hợp với nhu cầu',
        slug: 'huong-dan-chon-mua-iphone-phu-hop',
        content: 'Nội dung chi tiết về cách chọn mua iPhone phù hợp với nhu cầu sử dụng...',
        excerpt: 'Tìm hiểu cách chọn mua iPhone phù hợp nhất với nhu cầu và ngân sách của bạn',
        featuredImage: 'https://example.com/post-iphone.jpg',
        authorId: users[0]._id,
        status: PostStatus.PUBLISHED,
        type: PostType.TUTORIAL,
        tags: ['iPhone', 'Hướng dẫn', 'Mua sắm'],
        categories: ['Công nghệ', 'Hướng dẫn'],
        viewCount: 1250,
        likeCount: 89,
        commentCount: 23,
        publishedAt: new Date(),
      },
      {
        title: 'Top 10 laptop tốt nhất năm 2024',
        slug: 'top-10-laptop-tot-nhat-2024',
        content: 'Danh sách 10 laptop tốt nhất năm 2024 với đánh giá chi tiết...',
        excerpt: 'Khám phá top 10 laptop được đánh giá cao nhất trong năm 2024',
        featuredImage: 'https://example.com/post-laptop.jpg',
        authorId: users[0]._id,
        status: PostStatus.PUBLISHED,
        type: PostType.REVIEW,
        tags: ['Laptop', 'Review', 'Top 10'],
        categories: ['Công nghệ', 'Review'],
        viewCount: 2100,
        likeCount: 156,
        commentCount: 45,
        publishedAt: new Date(),
      },
      {
        title: 'Xu hướng thời trang mùa hè 2024',
        slug: 'xu-huong-thoi-trang-mua-he-2024',
        content: 'Những xu hướng thời trang hot nhất mùa hè 2024...',
        excerpt: 'Cập nhật những xu hướng thời trang không thể bỏ qua trong mùa hè này',
        featuredImage: 'https://example.com/post-fashion.jpg',
        authorId: users[0]._id,
        status: PostStatus.PUBLISHED,
        type: PostType.ARTICLE,
        tags: ['Thời trang', 'Xu hướng', 'Mùa hè'],
        categories: ['Thời trang', 'Lifestyle'],
        viewCount: 890,
        likeCount: 67,
        commentCount: 18,
        publishedAt: new Date(),
      },
    ];

    const posts = await this.postModel.insertMany(postsData);
    console.log(`✅ Đã tạo ${posts.length} posts`);
  }
}