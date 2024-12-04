import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatroomUsers, ChatroomUsersSchema } from './schemas/chatroom-users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatroomUsers.name, schema: ChatroomUsersSchema }])],
  providers: [],
  controllers: [],
})
export class ChatroomUsersModule {}
