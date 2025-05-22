import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth } from './auth.interface'
import { UsersService } from 'src/users/users.service'
import { User } from 'generated/prisma'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { Payload } from '../auth/auth.interface'

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
      const { email, password } = data

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const { user, token } = await this.authService.get_token(email, password)
      return res.json({ user, token, auth: true })
    } catch (error: unknown) {
      res.status(400).json({
        message: (error as Error).message,
      })
      return res
    }
  }
  @Post('sign-up')
  async register(
    @Body()
    data: User,
    @Res()
    res: Response,
  ) {
    try {
      const { user, auth, token } = await this.authService.signup(data)
      return res.json({ user, auth, token })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: (error as Error).message,
      })
      return res
    }
  }

  @UseGuards(AuthGuard)
  @Get('payload')
  payload(@Request() req: { payload: Payload }) {
    return req.payload
  }
}
