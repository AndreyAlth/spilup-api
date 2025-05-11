import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { TokenBalanceService } from './services/token-balance.service'
import { TokenTransactionService } from './services/token-transaction.service'
import { Token_balance, Token_transaction } from 'generated/prisma'
import { TokenType } from './dto/constants'

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

  async generateTokens(userId: string, amount: number): Promise<Token_balance> {
    await this.user.verifyUser(userId)

    //this must be a transaction

    await this.transaction.createTransaction({
      userId,
      amount,
      type: TokenType.GENERATED,
      description: 'Tokens generated',
      metadata: {},
    })
    let balance = await this.balance.getBalance(userId)
    if (!balance) {
      balance = await this.balance.createBalance(userId, 0)
      // return new_balance
    }
    console.log(balance?.amount + amount)
    const newBalance = await this.balance.incrementBalance(userId, balance?.amount + amount)
    return newBalance
  }
}
