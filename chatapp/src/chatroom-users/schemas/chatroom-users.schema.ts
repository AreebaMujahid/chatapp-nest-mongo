import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatroomUsers extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Chatroom', required: true })
  chatroom: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const ChatroomUsersSchema = SchemaFactory.createForClass(ChatroomUsers);
