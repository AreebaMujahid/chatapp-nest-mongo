import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { TokenService } from './token/token.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LiveChatroomModule } from './live-chatroom/live-chatroom.module';

const pubSub = new RedisPubSub({
   connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379' , 10),
    retryStrategy : (times) => {
      //retry strategy
      return Math.min(times *50 , 2000);

    },
   },

});

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true, // Makes configuration globally available
    }),
      
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: '/',
      }),
    
    // MongoDB connection using Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Use ConfigModule to load environment variables
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Load MongoDB URI from .env
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    
    // GraphQL module setup
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],  
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService ,tokenService: TokenService,) => ({
        installSubscriptionHandlers: true,
        playground: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },


        //agr user nay real time chat app maiy kisi bhi chat maiy enter hona ha or real time subscription bhi chahye to us kay liye pehly user ko before subscription validate bhi kia jaata ha ye usi ka code ha 
        onConnect: (connectionParams) => {
          const token = tokenService.extractToken(connectionParams);

          if (!token) {
            throw new Error('Token not provided');
          }
          const user = tokenService.validateToken(token);
          if (!user) {
            throw new Error('Invalid token');
          }
          return { user };
        },
        context: ({ req, res, connection }) => {
          if (connection) {
            return { req, res, user: connection.context.user, pubSub }; // Injecting pubSub into context
          }
          return { req, res };
        },
      }),
    }),
    
    
    // Application modules
    AuthModule,
    UserModule,
    TokenService,
    LiveChatroomModule,
  ],
  
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule {}
