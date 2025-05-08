import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { TokenBalanceService } from './services/token-balance.service'
// import { TokenTransactionService } from './services/token-transaction.service'

@Injectable()
export class TokensService {
  constructor(
    private readonly user: UsersService,
    private readonly balance: TokenBalanceService,
    // private readonly transaction: TokenTransactionService,
  ) {}

  async getUserBalance(userId: string): Promise<{ amount: number }> {
    await this.user.verifyUser(userId)

    const balance = await this.balance.getBalance(userId)

    return { amount: balance?.amount ?? 0 }
  }
}
