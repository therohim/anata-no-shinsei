import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({
  timestamps:true
})
export class Room extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participants: string[]; // Array of user IDs

  @Prop({ required: true })
  last_message: string;
}

const RoomSchema = SchemaFactory.createForClass(Room);
export { RoomSchema };
