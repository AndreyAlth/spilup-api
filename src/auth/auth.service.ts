import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async get_token(email: string, password: string) {
    if (!(typeof process.env.JWT_SECTRET == 'string')) {
      throw new Error('Forgot to set SECRET env variable');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const valid = await this.usersService.validatePassword(email, password);
    if (!valid) throw new Error('Invalid password');

    const token1 = jwt.sign({ username: user.name }, user.email, {
      expiresIn: '8h',
    });
    const token2 = jwt.sign(
      { username: user.name, token1 },
      process.env.JWT_SECTRET,
      {
        expiresIn: '8h',
      },
    );
    return token2;
  }
}
