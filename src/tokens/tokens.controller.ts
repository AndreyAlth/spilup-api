import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Payload } from '../auth/auth.interface'

@UseGuards(AuthGuard)
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('my-balance')
  async getBalance(@Request() req: { payload: Payload }) {
    const userId = req.payload.userId
    const balance = await this.tokensService.getUserBalance(userId)
    return balance
  }

  @Get('transactions-history')
  async getTransactions(@Request() req: { payload: Payload }) {
    const userId = req.payload.userId
    const transactions = await this.tokensService.getUserTransactions(userId)
    return transactions
  }

  @Post('buy-tokens')
  generateTokens(@Body() body: { amount: number }, @Request() req: { payload: Payload }) {
    const userId = req.payload.userId
    const amount = body.amount
    const tokens = this.tokensService.generateTokens(userId, amount)
    return tokens
  }

  @Post('burn-tokens')
  burnTokens(@Body() body: any) {
    return 'your tokens have been burned'
  }
}
