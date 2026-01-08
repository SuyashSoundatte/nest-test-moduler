import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';

interface createUserDTO {
  name: string;
  isActive: boolean;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  creatUser(@Body() dto: createUserDTO) {
    this.userService.createUser(dto);
    return 'user created';
  }
}
