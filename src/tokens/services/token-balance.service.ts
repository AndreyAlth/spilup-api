import { PrismaService } from 'src/prisma/prisma.service'
import { TokenBalanceDto } from '../dto/token-balance.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TokenBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string): Promise<TokenBalanceDto | null> {
    const balance = await this.prisma.token_balance.findMany({
      where: { id: userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    if (!balance[0]) {
      // throw new Error('Balance not found')
      return null
    }

    return balance[0]
  }

  async createBalance(userId: string, amount: number): Promise<TokenBalanceDto> {
    const balance = await this.prisma.token_balance.create({
      data: {
        userId,
        amount,
      },
    })

    return balance
  }

  async updateBalance(userId: string, amount: number): Promise<TokenBalanceDto> {
    const balance = await this.getBalance(userId)
    if (!balance) {
      throw new Error('Balance not found')
    }
    const balance_update = await this.prisma.token_balance.update({
      where: { id: balance.id },
      data: { amount },
    })

    return balance_update
  }

  // async createOrUpdateBalance(userId: string, amount: number): Promise<TokenBalanceDto> {
  //   let balance = await this.getBalance(userId)

  //   if (!balance) {
  //     balance = await this.prisma.token_balance.create({
  //       data: {
  //         userId,
  //         amount,
  //       },
  //     })
  //   } else {
  //     balance = await this.prisma.token_balance.update({
  //       where: { id: balance.id },
  //       data: { amount },
  //     })
  //   }
  //   return balance
  // }

  async incrementBalance(userId: string, amount: number): Promise<TokenBalanceDto> {
    let balance = await this.getBalance(userId)

    if (!balance) {
      balance = await this.createBalance(userId, amount)
      return balance
    }

    balance = await this.prisma.token_balance.update({
      where: { id: balance.id },
      data: { amount: balance.amount + amount },
    })
    return balance
  }

  async decrementBalance(userId: string, amount: number): Promise<TokenBalanceDto> {
    let balance = await this.getBalance(userId)

    if (!balance) {
      throw new Error('Balance not found')
    }

    if (balance.amount < amount) {
      throw new Error('Insufficient balance')
    }

    balance = await this.prisma.token_balance.update({
      where: { id: balance.id },
      data: { amount: balance.amount - amount },
    })
    return balance
  }
}
