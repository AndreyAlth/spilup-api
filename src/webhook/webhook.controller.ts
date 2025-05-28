/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { WebhookService } from './webhook.service'
import * as NodeRSA from 'node-rsa'

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name)
  private readonly conektaPublicKey = new (NodeRSA as any)(process.env.CONEKTA_WEBHOOK_PUBLIC_KEY ?? '')

  constructor(private readonly webhookService: WebhookService) {}

  @Post('conekta')
  handleConektaWebhook(@Body() payload: any, @Headers('digest') signature: string) {
    this.logger.log('Received Conekta webhook')
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`)
    this.logger.debug(`Signature: ${signature}`)

    try {
      // Validate the signature
      const isValid = this.validateSignature(payload, signature)
      if (!isValid) {
        throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED)
      }

      const { type, data } = payload

      this.logger.log(`Received webhook: ${type}`)

      console.log('this is your payload', payload)

      // Process the webhook event
      this.webhookService.processEvent(type, data)

      return { status: 'success' }
    } catch (error) {
      this.logger.error('Error processing Conekta webhook', error)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private validateSignature(payload: any, signature: string): boolean {
    if (!signature) return false

    const webhookSecret = process.env.CONEKTA_WEBHOOK_PUBLIC_KEY
    if (!webhookSecret) {
      this.logger.error('CONEKTA_WEBHOOK_SECRET is not set')
      return false
    }

    const isValid: boolean = this.conektaPublicKey.verify(payload, signature, 'utf8', 'base64')

    if (!isValid) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED)
    }

    this.logger.log('Signature is valid')
    return Boolean(isValid)
  }
}
