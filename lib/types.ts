export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category: string | null
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

export interface OrderAddress {
  name: string
  last_name: string
  address: string
  city: string
  postal_code: string
  province: string
  phone: string
}

export interface Order {
  id: number
  mp_preference_id: string | null
  mp_payment_id: string | null
  status: 'pending' | 'paid' | 'cancelled'
  items: CartItem[]
  total: number
  customer_email: string | null
  address: OrderAddress | null
  shipping_cost: number
  created_at: string
}

export type TelegramSession = {
  step:
    | 'idle'
    | 'awaiting_price'
    | 'awaiting_name'
    | 'awaiting_description'
    | 'awaiting_category'
    | 'awaiting_stock'
    | 'awaiting_delivery'
    | 'awaiting_payment'
    | 'confirming'
  photo_file_id?: string
  price?: number
  name?: string
  description?: string
  category?: string
  stock?: number
  delivery?: string[]
  accepts_mp?: boolean
}
