import { Injectable, Logger } from '@nestjs/common'
import { OrderResponse } from 'conekta'

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor() {}

  handleOrderPaid(order: OrderResponse) {
    this.logger.log(`Processing paid order: ${order.id}`)
    try {
      this.logger.log(`Order ${order.id} processed successfully`)
    } catch (error) {
      this.logger.error(`Error processing order ${order.id}:`, error)
      throw error
    }
  }

  processEvent(type: any, data: any) {
    switch (type) {
      case 'order.paid':
        this.handleOrderPaid(data.object)
        break

      default:
        this.logger.warn(`Unhandled webhook type: ${type}`)
        break
    }
    return { received: true }
  }
}
