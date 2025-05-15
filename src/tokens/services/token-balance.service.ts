import { PrismaService } from 'src/prisma/prisma.service'
import { TokenBalanceDto } from '../dto/token-balance.dto'
import { Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma'

@Injectable()
export class TokenBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string, prismaClient?: Prisma.TransactionClient): Promise<TokenBalanceDto | null> {
    const client = prismaClient || this.prisma
    const balance = await client.token_balance.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    console.log(balance)

    if (!balance[0]) {
      // const newBalance = await this.createBalance(userId, 0)
      return null
    }

    return balance[0]
  }

  async createBalance(
    userId: string,
    amount: number,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<TokenBalanceDto> {
    const client = prismaClient || this.prisma
    const balance = await client.token_balance.create({
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

  async incrementBalance(
    userId: string,
    amount: number,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<TokenBalanceDto> {
    const client = prismaClient || this.prisma
    let balance = await this.getBalance(userId, client)

    if (!balance) {
      balance = await this.createBalance(userId, 0, client)
      return balance
    }

    balance = await client.token_balance.update({
      where: { id: balance.id },
      data: { amount: amount },
    })
    return balance
  }

  async decrementBalance(
    userId: string,
    amount: number,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<TokenBalanceDto> {
    const client = prismaClient || this.prisma
    let balance = await this.getBalance(userId, client)

    if (!balance) {
      throw new Error('Balance not found')
    }

    if (balance.amount < amount) {
      throw new Error('Insufficient balance')
    }

    balance = await client.token_balance.update({
      where: { id: balance.id },
      data: { amount: amount },
    })
    return balance
  }
}
