export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | string;
  stock: number;
  sku: string;
  image_url: string;
  secondary_image_url?: string;
  product_title?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  fabric_details: string;
  care_instructions: string;
  fit: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  rating: number;
  reviews_count: number;
  created_at?: string;
  variants?: ProductVariant[];
  available_colors?: { name: string; hex: string; image_url: string }[];
  available_sizes?: string[];
  total_stock?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  imageUrl: string;
  maxStock: number;
}

export type DiscountType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_percent: number;
  discount_amount: number;
  min_order_value: number;
  usage_limit?: number | null;
  per_user_limit: number;
  times_used: number;
  expires_at?: string | null;
  active: boolean;
  description: string;
  created_at?: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_title: string;
  color_name: string;
  size: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address | string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_code?: string;
  status: OrderStatus;
  payment_status: 'Paid' | 'Pending' | 'Failed';
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  status: 'active' | 'banned';
  phone?: string;
  avatar?: string;
  created_at?: string;
  orders_count?: number;
  total_spent?: number;
}

export interface AdminDashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: Order[];
}

export type PlacementSlot =
  | 'hero_banner'
  | 'home_ad_campaign'
  | 'home_ad_strip'
  | 'shop_banner'
  | 'savoir_faire';

export interface Placement {
  id: string;
  slot_key: PlacementSlot;
  title?: string;
  subtitle?: string;
  badge_text?: string;
  image_url: string;
  link_url?: string;
  cta_text?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  badge_text?: string;
  image_url: string;
  mobile_image_url?: string;
  button_text: string;
  button_link: string;
  text_alignment?: 'left' | 'center' | 'right';
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface AnnouncementMessage {
  id: string;
  message: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface MarqueeItem {
  id: string;
  text: string;
  icon_name?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface TrustPillar {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  icon?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}

export interface SocialProofNotification {
  id: string;
  customer_name?: string;
  product_title: string;
  product_image?: string;
  product_image_url?: string;
  product_url?: string;
  city: string;
  time_ago?: string;
  is_active: boolean;
}

export interface SiteSettings {
  store_name: string;
  store_tagline?: string;
  logo_url?: string;
  support_phone: string;
  support_email: string;
  whatsapp_number: string;
  instagram_url?: string;
  facebook_url?: string;
  pinterest_url?: string;
  free_shipping_threshold: number;
  standard_shipping_fee?: number;
  cod_enabled?: boolean;
  exit_intent_enabled: boolean;
  exit_intent_coupon?: string;
  exit_intent_discount_code?: string;
  social_proof_enabled?: boolean;
  social_proof_interval_sec?: number;
}

export interface RackGarmentItem {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  color_name: string;
  color_hex: string;
  fabric: string;
  price: number;
  compare_at_price?: number;
  badge: string;
  description: string;
  fixture_folder?: string;
  atlas_url: string;
  profile_url: string;
  front_url: string;
  back_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

