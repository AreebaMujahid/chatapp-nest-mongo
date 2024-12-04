
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chatroom', required: true })
  chatroom: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
