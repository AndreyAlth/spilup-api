import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { TokenBalanceService } from './services/token-balance.service'
import { TokenTransactionService } from './services/token-transaction.service'
import { Token_balance, Token_transaction } from 'generated/prisma'
import { TokenType } from './dto/constants'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TokensService {
  constructor(
    private readonly user: UsersService,
    private readonly balance: TokenBalanceService,
    private readonly transaction: TokenTransactionService,
    private readonly prisma: PrismaService,
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

    const newBalance_data = await this.prisma.$transaction(async (prismaClient) => {
      await this.transaction.createTransaction(
        {
          userId,
          amount,
          type: TokenType.GENERATED,
          description: 'Tokens generated',
          metadata: {},
        },
        prismaClient,
      )
      let balance = await this.balance.getBalance(userId, prismaClient)
      if (!balance) {
        balance = await this.balance.createBalance(userId, 0, prismaClient)
        // return new_balance
      }
      const newBalance = await this.balance.incrementBalance(userId, balance?.amount + amount, prismaClient)
      return newBalance
    })

    return newBalance_data
  }

  async burnTokens(userId: string, amount: number): Promise<Token_balance> {
    if (amount < 0) throw new Error('Amount must be greater than 0')

    await this.user.verifyUser(userId)

    const currentBalance = await this.balance.getBalance(userId)
    if (!currentBalance) throw new Error('Balance not found')
    if (currentBalance.amount < amount) throw new Error('Not enough balance')

    //burn tokens
    const newBalance_data = await this.prisma.$transaction(async (prismaClient) => {
      await this.transaction.createTransaction(
        {
          userId,
          amount: -amount,
          type: TokenType.BURNED,
          description: 'Tokens burned',
          metadata: {},
        },
        prismaClient,
      )
      const newBalance = await this.balance.decrementBalance(userId, currentBalance.amount - amount, prismaClient)
      return newBalance
    })
    return newBalance_data
  }
}
