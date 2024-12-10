import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    JwtModule.register({
      secret: 'defaultSecret',
      signOptions: {expiresIn : '1h'},

    }),
    ConfigModule,
    UserModule,

  ],
  providers: [AuthResolver, AuthService]
})
export class AuthModule {}
