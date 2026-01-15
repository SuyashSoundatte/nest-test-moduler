import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

interface createUserDTO {
  name: string;
  isActive: boolean;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: User) {
    await this.userService.createUser(user);
    return {
      message: 'User created successfully',
    };
  }

  @Get()
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.userService.getUserById(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User) {
    const updated = await this.userService.updateUser({
      ...user,
      id: +id,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User updated' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deleted = await this.userService.deleteUser(+id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted' };
  }
}
