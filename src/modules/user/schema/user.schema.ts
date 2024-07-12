import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  // @Prop({ type: Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop({ index: true })
  name?: string;

  @Prop({ index: true })
  phone?: string;

  @Prop()
  country?: string;

  @Prop()
  province_state?: string;

  @Prop()
  address?: string;

  @Prop({ unique: true, index: true })
  email?: string;

  @Prop({ unique: true, index: true })
  username?: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  gender?: string;

  @Prop({ required: true, type: Date })
  birthday?: Date;

  @Prop()
  horoscope?: string;

  @Prop()
  zodiac?: string;

  @Prop()
  height?: number;

  @Prop()
  weight?: number;

  @Prop([String])
  interests: string[];

  @Prop()
  hashdRt?: string;

  @Prop({
    default:false
  })
  is_deleted: boolean;

  @Prop({
    default:new Date()
  })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
