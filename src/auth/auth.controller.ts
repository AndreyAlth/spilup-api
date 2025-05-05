import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth.interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  login(@Body() data: Auth) {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    return this.usersService.validatePassword(email, password);
  }
  @Post('register')
  register(@Body() data: User) {
    return this.usersService.create(data);
  }
}
