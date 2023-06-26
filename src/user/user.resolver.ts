import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user-input';
import { User } from './user.entity';
import { UpdateUserInput } from './dto/update-user-input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async findUser(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    return user;
  }

  @Query(() => User)
  async findUserByEmail(@Args('email') email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('data') data: CreateUserInput,
  ): Promise<CreateUserInput> {
    const user = await this.userService.createUser(data);
    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userService.updateUser(id, data);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const status = await this.userService.deleteUser(id);
    return status;
  }
}
