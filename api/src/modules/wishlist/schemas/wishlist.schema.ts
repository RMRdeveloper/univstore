import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  products!: Types.ObjectId[];

  createdAt!: Date;
  updatedAt!: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ user: 1 });
