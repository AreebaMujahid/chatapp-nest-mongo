import {
    BadRequestException,    //jb user invalid type ki input deta ha
    Injectable,             //for dependency
    UnauthorizedException,  //when user is not authenticate(valid user)
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';   //provides methods to sign and verify json web token
  import { ConfigService } from '@nestjs/config';  // to use secret data from env
  import { Request, Response } from 'express';   // req res variables when working with http requests and response
  import { LoginDto, RegisterDto } from './dto';
  import { User } from '../user/schema/user.schema';
  import {Model} from 'mongoose';

  import * as bcrypt from 'bcrypt';     // for hashing and comparing passwords secretly
import { InjectModel } from '@nestjs/mongoose';
  @Injectable()                         // making AuthSErvice as provider
  export class AuthService {
    constructor(
      private readonly jwtService: JwtService,       //variable for json web token
      private readonly configService: ConfigService,   // variable for config
      @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}
    // if access token expires --> user can request refreshtoken to generate new access token -- if refreshtoken is invalid user is loggedout
    async refreshToken(req: Request, res: Response) {       // this method is to GET refresh token  
      const refreshToken = req.cookies['refresh_token'];     //extract refresh token from cookies  
  
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');      // if not found in cookies it means not authenticated user
      }
      let payload;
      try {
        payload = this.jwtService.verify(refreshToken, {    // (compare )     refreshtoken in cookie != refresh token in .env file  -->  error
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        });
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      //if refreshtoken in env == refresh token in cookie , then check if that user exists in db?by getting userid from payload in jwt
      // yahan pr db access krnay kay liye ye code add hoa :
      //1-import { User } from '../user/schema/user.schema';
      //2-import {Model} from 'mongoose';
      //3-auth.module.ts bhi update hoa
      //4-user.module.ts bhi update hoa
      
      const userExists = await this.userModel.findById(payload.sub);
      if (!userExists) {
        throw new BadRequestException('User no longer exists');
      }
  
      // setting expiration for newly generated access token
      const expiresIn = 15000;
      const expiration = Math.floor(Date.now() / 1000) + expiresIn;

      // generate access token on the basis of that setted expiration time
      const accessToken = this.jwtService.sign(
        { ...payload, exp: expiration },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        },
      );
      // set this newly generated token in the http only cookie for security
      res.cookie('access_token', accessToken, { httpOnly: true });
  
      return accessToken;
    }


    // this method is to SET NEW refreshtoken and accessToken
    private async issueTokens(user: User, response: Response) {
<<<<<<< HEAD
=======
      
>>>>>>> origin/main
      const payload = { username: user.fullname, sub: user.id };
  
      const accessToken = this.jwtService.sign(
        { ...payload },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '150sec',
        },
      );
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      });
  
      response.cookie('access_token', accessToken, { httpOnly: true });
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
      });
      return { user };
    }
  
    async validateUser(loginDto: LoginDto) {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });
      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        return user;
      }
      return null;
    }
    async register(registerDto: RegisterDto, response: Response) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });
      if (existingUser) {
        throw new BadRequestException({ email: 'Email already in use' });
      }
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          fullname: registerDto.fullname,
          password: hashedPassword,
          email: registerDto.email,
        },
      });
      return this.issueTokens(user, response);
    }
  
    async login(loginDto: LoginDto, response: Response) {
      const user = await this.validateUser(loginDto);
      if (!user) {
        throw new BadRequestException({
          invalidCredentials: 'Invalid credentials',
        });
      }
      return this.issueTokens(user, response);
    }
    async logout(response: Response) {
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      return 'Successfully logged out';
    }
  }