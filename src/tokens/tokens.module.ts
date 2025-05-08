import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { TokensController } from './tokens.controller'
import { UsersModule } from 'src/users/users.module'
// import { TokensRepositoryModule } from './services/tokens-repository.module'
import { TokenBalanceService } from './services/token-balance.service'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  controllers: [TokensController],
  providers: [TokensService, TokenBalanceService],
  imports: [UsersModule, PrismaModule],
})
export class TokensModule {}
