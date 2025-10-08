import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedDataService } from './seed-data';
import { User, UserSchema } from '../users/user.schema';
import { Category, CategorySchema } from '../categories/category.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { Post, PostSchema } from '../posts/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [SeedDataService],
  exports: [SeedDataService],
})
export class DatabaseModule {}