import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, Token_transaction } from 'generated/prisma'
import { CreateTokenTransactionDto } from '../dto/create-token-transaction.dto'

@Injectable()
export class TokenTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactions(userId: string): Promise<Token_transaction[]> {
    const transactions = await this.prisma.token_transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    if (!transactions) {
      throw new Error('Transactions not found')
    }

    return transactions
  }

  async getTransactionById(id: string): Promise<Token_transaction> {
    const transaction = await this.prisma.token_transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return transaction
  }

  async createTransaction(
    transaction: CreateTokenTransactionDto,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<Token_transaction> {
    const client = prismaClient || this.prisma
    const createdTransaction = await client.token_transaction.create({
      data: transaction,
    })

    return createdTransaction
  }
}
