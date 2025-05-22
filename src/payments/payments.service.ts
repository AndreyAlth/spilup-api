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
    console.log(process.env.CONEKTA_API_KEY)
    try {
      const customerResponse = await this.createCustomer(customer)
      if (!customerResponse) throw Error('Error creating order')
      console.log(customerResponse)
      // const orderData: OrderRequest = {
      //   currency: 'MXN',
      //   customer_info: {
      //     customer_id: 'ndksndk', // El ID del cliente previamente creado
      //   },
      //   line_items: [
      //     {
      //       name: '',
      //       unit_price: 10 * 100, // Conekta espera el precio en centavos
      //       quantity: 1,
      //     },
      //   ],
      //   charges: [
      //     {
      //       payment_method: {
      //         type: 'card',
      //         token_id: 'xlmsd', // Token generado en el frontend con Conekta.js
      //       },
      //     },
      //   ],
      //   checkout: {
      //     allowed_payment_methods: ['card'],
      //     expires_at: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 horas de expiración
      //   },
      // }
      // const orderResponse = await this.createOrder(orderData)
      // return orderResponse
    } catch (error) {
      console.log(error)
    }
  }
}
