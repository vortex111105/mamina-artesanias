export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  delivery: string[]
  accepts_mp: boolean
  visible: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  delivery_method: string
}

export interface Order {
  id: number
  mp_preference_id: string | null
  mp_payment_id: string | null
  status: 'pending' | 'paid' | 'cancelled'
  items: CartItem[]
  total: number
  customer_email: string | null
  created_at: string
}

export type TelegramSession = {
  step:
    | 'idle'
    | 'awaiting_price'
    | 'awaiting_name'
    | 'awaiting_description'
    | 'awaiting_stock'
    | 'awaiting_delivery'
    | 'awaiting_payment'
    | 'confirming'
  photo_file_id?: string
  price?: number
  name?: string
  description?: string
  stock?: number
  delivery?: string[]
}
