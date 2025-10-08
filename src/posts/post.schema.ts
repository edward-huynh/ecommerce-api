import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PostType {
  ARTICLE = 'article',
  NEWS = 'news',
  TUTORIAL = 'tutorial',
  REVIEW = 'review',
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
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt?: string;

  @Prop()
  featuredImage?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Prop({ type: String, enum: PostType, default: PostType.ARTICLE })
  type: PostType;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ default: true })
  allowComments: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop({ type: Object })
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Virtual for id
PostSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});