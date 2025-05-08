import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common'
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
  getTransactions(@Request() req: any) {
    return 'your transactions'
  }

  @Post('buy-tokens')
  generateTokens(@Body() body: any) {
    return 'your tokens have been generated'
  }

  @Post('burn-tokens')
  burnTokens(@Body() body: any) {
    return 'your tokens have been burned'
  }
}
