import * as jwt from 'jsonwebtoken'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtPayloadUser } from './auth.interface'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { User, Prisma } from 'generated/prisma'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async get_token(email: string, password: string, prismaClient?: Prisma.TransactionClient) {
    const client = prismaClient || this.prisma
    if (!(typeof jwtConstants.secret == 'string')) {
      throw new Error('Forgot to set SECRET env variable')
    }

    const user = await this.usersService.findByEmail(email, client)
    if (!user) {
      throw new Error('User not found')
    }

    const valid = await this.usersService.validatePassword(email, password, client)
    if (!valid) throw new UnauthorizedException()

    const token1 = this.jwtService.sign(
      { email: user.email, userId: user.id },
      {
        secret: user.email,
        expiresIn: '8h',
      },
    )
    const token2 = this.jwtService.sign(
      { email: user.email, userId: user.id, token1 },
      {
        secret: jwtConstants.secret,
        expiresIn: '8h',
      },
    )
    return { user, token: token2 }
  }

  async decode_token(token: string) {
    if (!(typeof jwtConstants.secret == 'string')) {
      throw new Error('Forgot to set SECRET env variable')
    }

    const decoded2 = this.jwtService.decode<JwtPayloadUser>(token)
    const user = await this.usersService.findByEmail(decoded2.email)
    if (!user) {
      throw new Error('User not found')
    }
    return jwt.verify(decoded2.token1, user.email)
  }

  async signup(data: User): Promise<{ user: Omit<User, 'password'>; token: string; auth: boolean }> {
    const token_user = await this.prisma.$transaction(async (prismaClient) => {
      const new_user = await this.usersService.create(data, prismaClient)
      if (!new_user) throw new Error('User not created')
      const { user, token } = await this.get_token(new_user.email, new_user.password, prismaClient)
      return { user, token, auth: true }
    })
    return token_user
  }
}
