import { Module } from '@nestjs/common'
import { WebhookService } from './webhook.service'
import { WebhookController } from './webhook.controller'
import { TokensService } from '../tokens/tokens.service'
import { TokenTransactionService } from 'src/tokens/services/token-transaction.service'
import { TokenBalanceService } from 'src/tokens/services/token-balance.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, TokensService, TokenBalanceService, TokenTransactionService, UsersService],
  imports: [PrismaModule, UsersModule],
})
export class WebhookModule {}
