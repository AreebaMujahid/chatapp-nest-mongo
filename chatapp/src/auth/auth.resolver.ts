import { Query, Resolver } from '@nestjs/graphql';  // Import from @nestjs/graphql

@Resolver()
export class AuthResolver {
  @Query(() => String)  
  async hello(){  
    return 'hello';
  }
}