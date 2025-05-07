import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayloadUser } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async get_token(email: string, password: string) {
    if (!(typeof jwtConstants.secret == 'string')) {
      throw new Error('Forgot to set SECRET env variable');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const valid = await this.usersService.validatePassword(email, password);
    if (!valid) throw new UnauthorizedException();

    const token1 = this.jwtService.sign(
      { email: user.email },
      {
        secret: user.email,
        expiresIn: '8h',
      },
    );
    const token2 = this.jwtService.sign(
      { email: user.email, token1 },
      {
        secret: jwtConstants.secret,
        expiresIn: '8h',
      },
    );
    return { user, token: token2 };
  }

  async decode_token(token: string) {
    if (!(typeof jwtConstants.secret == 'string')) {
      throw new Error('Forgot to set SECRET env variable');
    }

    const decoded2 = this.jwtService.decode<JwtPayloadUser>(token);
    const user = await this.usersService.findByEmail(decoded2.email);
    if (!user) {
      throw new Error('User not found');
    }
    return jwt.verify(decoded2.token1, user.email);
  }
}
