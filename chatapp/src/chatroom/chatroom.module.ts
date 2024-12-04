import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './schemas/chatroom.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chatroom.name, schema: ChatroomSchema }])],
  providers: [],
  controllers: [],
})
export class ChatroomModule {}
