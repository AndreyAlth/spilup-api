import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { PaymentsService } from './payments.service'
@Controller('payments/conekta')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create() {
    return 'order created'
  }

  @Get(':order_id')
  getOrder(@Param('order_id') order_id: string) {
    return order_id
  }
}
