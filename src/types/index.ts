export type UserRole = 'customer' | 'shop_owner' | 'wholesale' | 'offer_provider';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  location: string;
  pinCode: string;
  shopName?: string;
  businessName?: string;
  organizationName?: string;
  category?: string;
  isVerified?: boolean;
}

export type UnitType = 'kg' | 'g' | 'L' | 'ml' | 'pack' | 'pcs' | 'bunch';

export interface ShopPriceComparison {
  shopId: string;
  shopName: string;
  price: number;
  inStock: boolean;
  distanceKm: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy' | 'Pantry' | 'Bakery' | 'Beverages' | 'Household';
  quantity: number;
  unit: UnitType;
  estimatedPrice: number;
  isCompleted: boolean;
  matchedOfferId?: string;
  matchedOfferDiscount?: number;
  notes?: string;
  alternatives?: { name: string; estimatedPrice: number; savings: number }[];
  shopPrices: ShopPriceComparison[];
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  category: string;
  shopId?: string;
  shopName: string;
  validUntil: string;
  minSpend?: number;
  eligibleProductNames: string[];
  bannerColor: string;
  isVerified: boolean;
  active: boolean;
  sponsorName?: string;
}

export interface ShopInventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: UnitType;
  stock: number;
  minStockThreshold: number;
  isAvailable: boolean;
  demandSignalsCount: number;
  recentOrdersCount: number;
}

export interface DemandSignal {
  id: string;
  productName: string;
  category: string;
  totalRequestedUnits: number;
  unit: UnitType;
  customerCount: number;
  pinCode: string;
  trend: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: UnitType;
  shopId: string;
  shopName: string;
  savingsApplied?: number;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address: {
    pinCode: string;
    street: string;
    city: string;
  };
  shopName: string;
  estimatedDeliveryMin: number;
}

export interface WholesaleItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  moq: number;
  stockAvailable: number;
  supplierName: string;
  tierPricing: {
    minQty: number;
    pricePerUnit: number;
  }[];
}

export interface WholesaleOrder {
  id: string;
  orderNumber: string;
  retailerName: string;
  shopLocation: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'fulfilled';
  createdAt: string;
  deliveryDate: string;
}

export interface ProviderCampaign {
  id: string;
  title: string;
  brandName: string;
  category: string;
  couponCode: string;
  discountPercent: number;
  budgetLimit: number;
  budgetSpent: number;
  impressions: number;
  clicks: number;
  redemptions: number;
  participatingShopsCount: number;
  status: 'active' | 'paused' | 'pending_approval';
  startDate: string;
  endDate: string;
}

export interface AppNotification {
  id: string;
  targetRole: UserRole | 'all';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'offer' | 'demand' | 'order' | 'budget' | 'wholesale';
  actionableId?: string;
}
