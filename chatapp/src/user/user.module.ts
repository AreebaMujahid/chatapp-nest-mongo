import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [], // Add your services here
  controllers: [], // Add your controllers here

  exports: [MongooseModule],
})
export class UserModule {}
