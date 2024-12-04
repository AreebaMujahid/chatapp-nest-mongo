import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manages createdAt and updatedAt
export class User extends Document {
  @Prop({ required: true })
  fullname: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop({ required: true })
  password: string;

  @Prop()
  rememberToken?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Chatroom' }] })
  chatrooms: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
