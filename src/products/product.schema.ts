import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  shortDescription?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0, default: 0 })
  salePrice?: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop()
  sku?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ min: 0, default: 0 })
  reviewCount: number;

  @Prop({ min: 0 })
  weight?: number;

  @Prop({ type: Object })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object })
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Virtual for id
ProductSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});