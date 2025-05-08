import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { TokensController } from './tokens.controller'
import { UsersModule } from 'src/users/users.module'
import { TokenBalanceService } from './services/token-balance.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { TokenTransactionService } from './services/token-transaction.service'

@Module({
  controllers: [TokensController],
  providers: [TokensService, TokenBalanceService, TokenTransactionService],
  imports: [UsersModule, PrismaModule],
})
export class TokensModule {}
