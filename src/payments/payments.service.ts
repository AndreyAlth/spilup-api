import { Injectable } from '@nestjs/common'
// import { Customer } from './dto/customer-payment.dto';
import { Customer, Configuration, CustomersApi, CustomerResponse } from 'conekta'

@Injectable()
export class PaymentsService {
  constructor() {}

  conektaApiKey = process.env.CONEKTA_API_KEY
  config = new Configuration({ accessToken: this.conektaApiKey })
  client = new CustomersApi(this.config)

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
}
