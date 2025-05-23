import { Injectable } from '@nestjs/common'
// import { Customer } from './dto/customer-payment.dto';
import {
  Customer,
  Configuration,
  CustomersApi,
  CustomerResponse,
  OrdersApi,
  OrderResponse,
  OrderRequest,
} from 'conekta'

@Injectable()
export class PaymentsService {
  constructor() {}

  conektaApiKey = process.env.CONEKTA_API_KEY
  config = new Configuration({ accessToken: this.conektaApiKey })
  client = new CustomersApi(this.config)
  orderClient = new OrdersApi(this.config)

  async createCustomer(customer: Customer): Promise<CustomerResponse | undefined> {
    try {
      const response = await this.client.createCustomer(customer).then((response) => {
        const customerResponse = response.data
        return customerResponse
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async createOrder(order: OrderRequest): Promise<OrderResponse | undefined> {
    try {
      const response = await this.orderClient.createOrder(order).then((response) => {
        const orderResponse = response.data
        return orderResponse
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async createCheckout(customer: Customer, order: OrderRequest) {
    try {
      const customerResponse = await this.createCustomer(customer)
      if (!customerResponse) throw Error('Error creating order')
      const orderData: OrderRequest = {
        currency: 'MXN',
        customer_info: {
          customer_id: customerResponse.id,
          name: customerResponse.name,
          email: customerResponse.email,
          phone: customerResponse.phone,
        },
        line_items: [
          {
            name: 'tokens',
            unit_price: 20 * 100, // Conekta espera el precio en centavos
            quantity: 350000,
          },
        ],
        shipping_lines: [
          {
            amount: 0,
          },
        ],
        checkout: {
          type: 'HostedPayment',
          success_url: process.env.CONEKTA_URL_SUCCESS,
          failure_url: process.env.CONEKTA_URL_FAILURE,
          allowed_payment_methods: ['cash', 'card', 'bank_transfer'],
          monthly_installments_options: [3, 6, 9, 12, 18],
          expires_at: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 horas
        },
      }
      console.log(orderData)
      const orderResponse = await this.createOrder(orderData)
      return orderResponse
    } catch (error) {
      console.log(error)
    }
  }
}
