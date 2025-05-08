import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { AuthGuard } from 'src/auth/auth.guard'

@UseGuards(AuthGuard)
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('my-balance')
  getBalance(@Request() req: any) {
    return 'ypour balance is 100 tokens'
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
