export interface WebhookEvent {
  type: string
  data: WebhookData
}

export interface WebhookData {
  object: OrderObject
  previous_attributes: Record<string, unknown>
}

export interface OrderObject {
  livemode: boolean
  amount: number
  currency: string
  payment_status: string
  amount_refunded: number
  customer_info: CustomerInfo
  channel: Channel
  checkout: Checkout
  object: string
  id: string
  metadata: Record<string, unknown>
  is_refundable: boolean
  created_at: number
  updated_at: number
  line_items: ListData
  shipping_lines: ListData
  charges: ListData
}

export interface CustomerInfo {
  email: string
  phone: string
  name: string
  corporate: boolean
  customer_id: string
  object: string
}

export interface Channel {
  segment: string
  checkout_request_id: string
  checkout_request_type: string
  id: string
}

export interface Checkout {
  id: string
  name: string
  livemode: boolean
  emails_sent: number
  success_url: string
  failure_url: string
  paid_payments_count: number
  sms_sent: number
  status: string
  type: string
  recurrent: boolean
  starts_at: number
  expires_at: number
  allowed_payment_methods: string[]
  exclude_card_networks: string[]
  needs_shipping_contact: boolean
  monthly_installments_options: unknown[]
  monthly_installments_enabled: boolean
  force_3ds_flow: boolean
  metadata: Record<string, unknown>
  can_not_expire: boolean
  object: string
  is_redirect_on_failure: boolean
  slug: string
  url: string
}

export interface ListData {
  object: string
  has_more: boolean
  total: number
  data: LinesItemsData[]
}

export interface LinesItemsData {
  name: string
  unit_price: number
  quantity: number
  object: string
  id: string
  parent_id: string
  metadata: Record<string, unknown>
  antifraud_info: Record<string, unknown>
}
