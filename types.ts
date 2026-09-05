export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  calories?: number;
  preparationTime?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = 'delivery' | 'pickup';

export interface RestaurantInfo {
  name: string;
  tagline: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  status: string;
  hours: string;
  address: string;
  deliveryFee: number;
}
