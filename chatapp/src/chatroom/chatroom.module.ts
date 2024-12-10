import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomResolver } from './chatroom.resolver';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ChatroomService,
    ChatroomResolver,
    UserService,
    JwtService,
  ],
})
export class ChatroomModule {}