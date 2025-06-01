import { Injectable, Logger } from '@nestjs/common'
import { TokensService } from 'src/tokens/tokens.service'
import { UsersService } from 'src/users/users.service'
import { WebhookData } from './dto/webhook.dto'

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(
    private readonly tokenService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async handleOrderPaid(order: WebhookData) {
    this.logger.log(`Processing paid order: ${order.object.id}`)
    try {
      console.log(order.object.line_items.data[0].quantity, order.object.customer_info.email)
      const user = await this.userService.findByEmail(order.object.customer_info.email)
      console.log(user)
      // if (!user) throw new Error('User not found')
      // const tokens = await this.tokenService.generateTokens(user?.id, order.object.line_items.data[0].amount * 10)
      // this.logger.log(`Tokens generated: ${tokens.amount}`)
    } catch (error) {
      this.logger.error(`Error processing order ${order.object.id}:`, error)
      throw error
    }
  }

  async processEvent(type: string, data: WebhookData) {
    switch (type) {
      case 'order.paid':
        await this.handleOrderPaid(data)
        break

      default:
        this.logger.warn(`Unhandled webhook type: ${type}`)
        break
    }
    return { received: true }
  }
}
