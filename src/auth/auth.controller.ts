import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth.interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'generated/prisma';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  async login(
    @Body()
    data: Auth,
    @Res()
    res: Response,
  ) {
    try {
      const { email, password } = data;
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await this.usersService.findByEmail(email);
      console.log(user);
      if (!user) {
        throw new Error('User not found');
      }
      const isValid = await this.usersService.validatePassword(email, password);
      return res.json(isValid);
    } catch (error: unknown) {
      res.status(400).json({
        message: 'Login failed',
        error: (error as Error).message,
      });
      return res;
    }
  }
  @Post('register')
  register(
    @Body()
    data: User,
  ) {
    return this.usersService.create(data);
  }
}
