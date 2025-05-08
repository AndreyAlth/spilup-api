import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { TokenBalanceService } from './services/token-balance.service'
import { TokenTransactionService } from './services/token-transaction.service'
import { Token_transaction } from 'generated/prisma'

@Injectable()
export class TokensService {
  constructor(
    private readonly user: UsersService,
    private readonly balance: TokenBalanceService,
    private readonly transaction: TokenTransactionService,
  ) {}

  async getUserBalance(userId: string): Promise<{ amount: number }> {
    await this.user.verifyUser(userId)

    const balance = await this.balance.getBalance(userId)

    return { amount: balance?.amount ?? 0 }
  }

  async getUserTransactions(userId: string): Promise<Token_transaction[]> {
    await this.user.verifyUser(userId)

    const transactions = await this.transaction.getTransactions(userId)

    return transactions
  }
}
