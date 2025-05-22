import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { Customer, OrderRequest } from 'conekta'

@Controller('payments/conekta')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() body: { customer: Customer; order: any }) {
    const { customer, order } = body
    return this.paymentsService.createCheckout(customer, order)
  }

  @Get(':order_id')
  getOrder(@Param('order_id') order_id: string) {
    return order_id
  }
}
