import { useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  ShoppingItem,
  Offer,
  ShopInventoryItem,
  DemandSignal,
  CartItem,
  CustomerOrder,
  WholesaleItem,
  WholesaleOrder,
  ProviderCampaign,
  AppNotification,
  OrderStatus,
  UnitType,
} from '../types';
import { sound } from '../utils/sound';

const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  role: 'customer',
  name: 'Amirtha Rao',
  email: 'amirtha@example.com',
  phone: '+91 98450 12345',
  location: 'Indiranagar 100ft Road',
  pinCode: '560038',
  shopName: 'GreenMart Organics',
  businessName: 'Vanguard Agro Hub',
  organizationName: 'Heritage Foods Direct',
  category: 'Fresh Groceries',
  isVerified: true,
};

const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  {
    id: 'item-1',
    name: 'Cold Pressed Sunflower Oil',
    category: 'Pantry',
    quantity: 2,
    unit: 'L',
    estimatedPrice: 360,
    isCompleted: false,
    matchedOfferId: 'off-1',
    matchedOfferDiscount: 15,
    notes: 'Prefer glass bottle packaging',
    alternatives: [
      { name: 'Kisan Pure Groundnut Oil', estimatedPrice: 310, savings: 50 },
      { name: 'Organic Mustard Oil 2L', estimatedPrice: 320, savings: 40 },
    ],
    shopPrices: [
      { shopId: 'shop-1', shopName: 'GreenMart Organics', price: 340, inStock: true, distanceKm: 0.8 },
      { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: 360, inStock: true, distanceKm: 1.4 },
      { shopId: 'shop-3', shopName: 'Nature Fresh Store', price: 375, inStock: false, distanceKm: 2.1 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    name: 'Farm Fresh Organic Eggs',
    category: 'Dairy',
    quantity: 12,
    unit: 'pcs',
    estimatedPrice: 110,
    isCompleted: false,
    matchedOfferId: 'off-2',
    matchedOfferDiscount: 10,
    shopPrices: [
      { shopId: 'shop-1', shopName: 'GreenMart Organics', price: 105, inStock: true, distanceKm: 0.8 },
      { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: 115, inStock: true, distanceKm: 1.4 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    name: 'Basmati Rice Royal Aged',
    category: 'Pantry',
    quantity: 5,
    unit: 'kg',
    estimatedPrice: 450,
    isCompleted: false,
    alternatives: [
      { name: 'Sona Masoori Premium 5kg', estimatedPrice: 340, savings: 110 }
    ],
    shopPrices: [
      { shopId: 'shop-1', shopName: 'GreenMart Organics', price: 440, inStock: true, distanceKm: 0.8 },
      { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: 460, inStock: true, distanceKm: 1.4 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-4',
    name: 'Crisp Bell Peppers (Tricolor)',
    category: 'Produce',
    quantity: 500,
    unit: 'g',
    estimatedPrice: 90,
    isCompleted: true,
    shopPrices: [
      { shopId: 'shop-1', shopName: 'GreenMart Organics', price: 85, inStock: true, distanceKm: 0.8 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-5',
    name: 'Alphonso Mangoes (Ratnagiri)',
    category: 'Produce',
    quantity: 1,
    unit: 'pack',
    estimatedPrice: 420,
    isCompleted: false,
    shopPrices: [
      { shopId: 'shop-1', shopName: 'GreenMart Organics', price: 420, inStock: true, distanceKm: 0.8 },
      { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: 450, inStock: true, distanceKm: 1.4 },
    ],
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Flash 15% OFF Cooking Oils',
    description: 'Demand-matched discount from GreenMart Organics for neighborhood shoppers',
    discountPercent: 15,
    code: 'EAGLE-OIL15',
    category: 'Pantry',
    shopId: 'shop-1',
    shopName: 'GreenMart Organics',
    validUntil: 'Today 9:00 PM',
    minSpend: 299,
    eligibleProductNames: ['Cold Pressed Sunflower Oil', 'Cooking Oil', 'Mustard Oil'],
    bannerColor: 'from-[#16834A] to-[#0D3328]',
    isVerified: true,
    active: true,
    sponsorName: 'GreenMart Special',
  },
  {
    id: 'off-2',
    title: '10% OFF Free-Range Dairy & Eggs',
    description: 'Sponsored by Heritage Farms on orders above ₹100',
    discountPercent: 10,
    code: 'FARM10',
    category: 'Dairy',
    shopId: 'shop-1',
    shopName: 'GreenMart Organics',
    validUntil: 'Tomorrow Midnight',
    minSpend: 100,
    eligibleProductNames: ['Farm Fresh Organic Eggs', 'Country Milk', 'Artisan Butter'],
    bannerColor: 'from-[#FF8A3D] to-[#B35212]',
    isVerified: true,
    active: true,
    sponsorName: 'Heritage Farms Direct',
  },
  {
    id: 'off-3',
    title: 'Flat ₹50 OFF Bulk Rice & Grains',
    description: 'Save big on 5kg+ premium staples this festive weekend',
    discountPercent: 12,
    code: 'RICE50',
    category: 'Pantry',
    shopId: 'shop-2',
    shopName: 'Daily SuperBazaar',
    validUntil: 'In 3 days',
    minSpend: 400,
    eligibleProductNames: ['Basmati Rice Royal Aged', 'Atta Flour', 'Brown Rice'],
    bannerColor: 'from-[#0D3328] to-[#16834A]',
    isVerified: true,
    active: true,
    sponsorName: 'Daily SuperBazaar',
  }
];

const INITIAL_INVENTORY: ShopInventoryItem[] = [
  { id: 'inv-1', name: 'Cold Pressed Sunflower Oil', category: 'Pantry', price: 170, unit: 'L', stock: 24, minStockThreshold: 10, isAvailable: true, demandSignalsCount: 42, recentOrdersCount: 18 },
  { id: 'inv-2', name: 'Basmati Rice Royal Aged', category: 'Pantry', price: 88, unit: 'kg', stock: 110, minStockThreshold: 30, isAvailable: true, demandSignalsCount: 120, recentOrdersCount: 35 },
  { id: 'inv-3', name: 'Farm Fresh Organic Eggs (6pk)', category: 'Dairy', price: 55, unit: 'pack', stock: 8, minStockThreshold: 15, isAvailable: true, demandSignalsCount: 65, recentOrdersCount: 22 },
  { id: 'inv-4', name: 'Alphonso Mangoes 1kg', category: 'Produce', price: 420, unit: 'pack', stock: 14, minStockThreshold: 5, isAvailable: true, demandSignalsCount: 38, recentOrdersCount: 9 },
  { id: 'inv-5', name: 'Nashik Red Onions', category: 'Produce', price: 32, unit: 'kg', stock: 6, minStockThreshold: 20, isAvailable: true, demandSignalsCount: 88, recentOrdersCount: 44 },
  { id: 'inv-6', name: 'Whole Wheat Chakki Atta 5kg', category: 'Pantry', price: 235, unit: 'pack', stock: 32, minStockThreshold: 10, isAvailable: true, demandSignalsCount: 54, recentOrdersCount: 26 },
];

const INITIAL_DEMAND_SIGNALS: DemandSignal[] = [
  { id: 'dem-1', productName: 'Cooking Oil / Sunflower Oil', category: 'Pantry', totalRequestedUnits: 48, unit: 'L', customerCount: 36, pinCode: '560038', trend: '+28%', urgency: 'high' },
  { id: 'dem-2', productName: 'Basmati & Aged Rice', category: 'Pantry', totalRequestedUnits: 125, unit: 'kg', customerCount: 42, pinCode: '560038', trend: '+15%', urgency: 'high' },
  { id: 'dem-3', productName: 'Nashik Red Onions', category: 'Produce', totalRequestedUnits: 85, unit: 'kg', customerCount: 29, pinCode: '560038', trend: '+34%', urgency: 'high' },
  { id: 'dem-4', productName: 'Organic Farm Eggs', category: 'Dairy', totalRequestedUnits: 240, unit: 'pcs', customerCount: 22, pinCode: '560038', trend: '+19%', urgency: 'medium' },
  { id: 'dem-5', productName: 'Alphonso Mangoes', category: 'Produce', totalRequestedUnits: 25, unit: 'pack', customerCount: 18, pinCode: '560038', trend: '+45%', urgency: 'medium' },
];

const INITIAL_WHOLESALE: WholesaleItem[] = [
  {
    id: 'ws-1',
    name: 'Refined Sunflower Oil (15L Tin)',
    category: 'Edible Oils',
    unit: 'Tin (15L)',
    moq: 5,
    stockAvailable: 280,
    supplierName: 'Vanguard Agro Hub Bangalore',
    tierPricing: [
      { minQty: 5, pricePerUnit: 1950 },
      { minQty: 20, pricePerUnit: 1875 },
      { minQty: 50, pricePerUnit: 1820 },
    ]
  },
  {
    id: 'ws-2',
    name: 'Royal Heritage Basmati Rice (50kg Bag)',
    category: 'Grains & Pulses',
    unit: '50kg Jute Sack',
    moq: 2,
    stockAvailable: 450,
    supplierName: 'Vanguard Agro Hub Bangalore',
    tierPricing: [
      { minQty: 2, pricePerUnit: 3600 },
      { minQty: 10, pricePerUnit: 3450 },
      { minQty: 25, pricePerUnit: 3300 },
    ]
  },
  {
    id: 'ws-3',
    name: 'Grade-A Nashik Onions (50kg Net Sack)',
    category: 'Fresh Bulk Produce',
    unit: '50kg Mesh Sack',
    moq: 4,
    stockAvailable: 600,
    supplierName: 'Sahyadri Agri Farmers Co-op',
    tierPricing: [
      { minQty: 4, pricePerUnit: 1250 },
      { minQty: 15, pricePerUnit: 1180 },
      { minQty: 30, pricePerUnit: 1100 },
    ]
  },
];

const INITIAL_WHOLESALE_ORDERS: WholesaleOrder[] = [
  {
    id: 'wo-101',
    orderNumber: 'WS-9842',
    retailerName: 'GreenMart Organics (Indiranagar)',
    shopLocation: 'Indiranagar 100ft Rd',
    items: [
      { name: 'Refined Sunflower Oil (15L Tin)', quantity: 10, unit: 'Tin', unitPrice: 1875 },
      { name: 'Royal Heritage Basmati Rice (50kg Bag)', quantity: 4, unit: 'Sack', unitPrice: 3600 }
    ],
    totalAmount: 33150,
    status: 'confirmed',
    createdAt: 'Today, 08:30 AM',
    deliveryDate: 'Tomorrow Morning',
  },
  {
    id: 'wo-102',
    orderNumber: 'WS-9838',
    retailerName: 'Daily SuperBazaar (Koramangala)',
    shopLocation: 'Koramangala 4th Block',
    items: [
      { name: 'Grade-A Nashik Onions (50kg Net Sack)', quantity: 8, unit: 'Sack', unitPrice: 1250 }
    ],
    totalAmount: 10000,
    status: 'dispatched',
    createdAt: 'Yesterday, 04:15 PM',
    deliveryDate: 'Today, 02:00 PM',
  }
];

const INITIAL_CAMPAIGNS: ProviderCampaign[] = [
  {
    id: 'cmp-1',
    title: 'Heritage Pure Ghee & Dairy Drive',
    brandName: 'Heritage Foods Direct',
    category: 'Dairy',
    couponCode: 'HERITAGE15',
    discountPercent: 15,
    budgetLimit: 40000,
    budgetSpent: 18450,
    impressions: 4200,
    clicks: 1320,
    redemptions: 486,
    participatingShopsCount: 14,
    status: 'active',
    startDate: '01 Oct 2026',
    endDate: '15 Oct 2026',
  },
  {
    id: 'cmp-2',
    title: 'SunRich Cold Pressed Festive Push',
    brandName: 'SunRich Agro',
    category: 'Pantry',
    couponCode: 'SUNRICH20',
    discountPercent: 20,
    budgetLimit: 60000,
    budgetSpent: 34200,
    impressions: 6850,
    clicks: 2190,
    redemptions: 742,
    participatingShopsCount: 22,
    status: 'active',
    startDate: '28 Sep 2026',
    endDate: '12 Oct 2026',
  }
];

const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-881',
    orderNumber: 'AQ-7842',
    createdAt: 'Yesterday at 6:40 PM',
    status: 'delivered',
    items: [
      { id: 'c-1', name: 'Cold Pressed Sunflower Oil', category: 'Pantry', price: 340, quantity: 1, unit: 'L', shopId: 'shop-1', shopName: 'GreenMart Organics' },
      { id: 'c-2', name: 'Crisp Bell Peppers (Tricolor)', category: 'Produce', price: 85, quantity: 500, unit: 'g', shopId: 'shop-1', shopName: 'GreenMart Organics' }
    ],
    subtotal: 425,
    discount: 45,
    deliveryFee: 0,
    total: 380,
    deliveryType: 'delivery',
    address: { pinCode: '560038', street: '12/4 2nd Cross, HAL 2nd Stage', city: 'Bangalore' },
    shopName: 'GreenMart Organics',
    estimatedDeliveryMin: 0
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    targetRole: 'customer',
    title: 'Eagle Match: 15% OFF Oil',
    message: 'GreenMart added 15% off Cold Pressed Sunflower Oil matching your shopping list!',
    timestamp: '10 min ago',
    read: false,
    type: 'offer',
    actionableId: 'off-1',
  },
  {
    id: 'notif-2',
    targetRole: 'shop_owner',
    title: 'Surge Demand Alert in 560038',
    message: '36 local customers added Cooking Oil to their shopping lists this week (+28%).',
    timestamp: '35 min ago',
    read: false,
    type: 'demand',
  },
  {
    id: 'notif-3',
    targetRole: 'customer',
    title: 'Budget Radar Update',
    message: 'You have ₹280 remaining in today\'s shopping budget. Eligible offers save ₹85!',
    timestamp: '1 hour ago',
    read: true,
    type: 'budget',
  }
];

// In-memory global store with listener pattern
interface State {
  user: UserProfile;
  currentRole: UserRole;
  isOnboarded: boolean;
  shoppingList: ShoppingItem[];
  budget: { tripLimit: number; monthlyLimit: number; spentThisMonth: number };
  offers: Offer[];
  shopInventory: ShopInventoryItem[];
  demandSignals: DemandSignal[];
  cart: CartItem[];
  orders: CustomerOrder[];
  wholesaleCatalog: WholesaleItem[];
  wholesaleOrders: WholesaleOrder[];
  campaigns: ProviderCampaign[];
  notifications: AppNotification[];
  customerTab: 'list' | 'budget' | 'offers' | 'cart';
  shopTab: 'dashboard' | 'demand' | 'inventory' | 'orders';
  wholesaleTab: 'catalog' | 'orders' | 'forecast';
  providerTab: 'campaigns' | 'analytics' | 'network';
  deliveryMode: 'delivery' | 'pickup';
  deliveryPinCode: string;
}

let globalState: State = {
  user: INITIAL_USER,
  currentRole: 'customer',
  isOnboarded: true, // starts onboarded for immediate rich review, with ability to restart
  shoppingList: INITIAL_SHOPPING_LIST,
  budget: { tripLimit: 1000, monthlyLimit: 14000, spentThisMonth: 7850 },
  offers: INITIAL_OFFERS,
  shopInventory: INITIAL_INVENTORY,
  demandSignals: INITIAL_DEMAND_SIGNALS,
  cart: [],
  orders: INITIAL_ORDERS,
  wholesaleCatalog: INITIAL_WHOLESALE,
  wholesaleOrders: INITIAL_WHOLESALE_ORDERS,
  campaigns: INITIAL_CAMPAIGNS,
  notifications: INITIAL_NOTIFICATIONS,
  customerTab: 'list',
  shopTab: 'dashboard',
  wholesaleTab: 'catalog',
  providerTab: 'campaigns',
  deliveryMode: 'delivery',
  deliveryPinCode: '560038',
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useAppStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    state: globalState,

    setRole: (role: UserRole) => {
      sound.playPop();
      globalState = {
        ...globalState,
        currentRole: role,
        user: { ...globalState.user, role }
      };
      notify();
    },

    setOnboarded: (val: boolean) => {
      globalState = { ...globalState, isOnboarded: val };
      notify();
    },

    setCustomerTab: (tab: 'list' | 'budget' | 'offers' | 'cart') => {
      sound.playPop();
      globalState = { ...globalState, customerTab: tab };
      notify();
    },

    setShopTab: (tab: 'dashboard' | 'demand' | 'inventory' | 'orders') => {
      sound.playPop();
      globalState = { ...globalState, shopTab: tab };
      notify();
    },

    setWholesaleTab: (tab: 'catalog' | 'orders' | 'forecast') => {
      sound.playPop();
      globalState = { ...globalState, wholesaleTab: tab };
      notify();
    },

    setProviderTab: (tab: 'campaigns' | 'analytics' | 'network') => {
      sound.playPop();
      globalState = { ...globalState, providerTab: tab };
      notify();
    },

    setDeliveryMode: (mode: 'delivery' | 'pickup') => {
      sound.playToggle();
      globalState = { ...globalState, deliveryMode: mode };
      notify();
    },

    setDeliveryPinCode: (pin: string) => {
      globalState = { ...globalState, deliveryPinCode: pin };
      notify();
    },

    // CUSTOMER SHOPPING LIST ACTIONS
    addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
      sound.playSuccess();
      const newItem: ShoppingItem = {
        ...item,
        id: `item-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Check if any active offers match this product
      const matchingOffer = globalState.offers.find((o) =>
        o.active && o.eligibleProductNames.some((p) => p.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(p.toLowerCase()))
      );

      if (matchingOffer) {
        newItem.matchedOfferId = matchingOffer.id;
        newItem.matchedOfferDiscount = matchingOffer.discountPercent;
      }

      const updatedList = [newItem, ...globalState.shoppingList];

      // Update Demand Signals reactively! (Demand-to-Offer Engine)
      const existingSignal = globalState.demandSignals.find((s) =>
        s.productName.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(s.productName.toLowerCase())
      );

      let updatedSignals = [...globalState.demandSignals];
      if (existingSignal) {
        updatedSignals = updatedSignals.map((s) =>
          s.id === existingSignal.id
            ? { ...s, totalRequestedUnits: s.totalRequestedUnits + item.quantity, customerCount: s.customerCount + 1 }
            : s
        );
      } else {
        updatedSignals.unshift({
          id: `dem-${Date.now()}`,
          productName: item.name,
          category: item.category,
          totalRequestedUnits: item.quantity,
          unit: item.unit,
          customerCount: 1,
          pinCode: globalState.user.pinCode || '560038',
          trend: '+100%',
          urgency: 'medium',
        });
      }

      globalState = {
        ...globalState,
        shoppingList: updatedList,
        demandSignals: updatedSignals,
      };
      notify();
    },

    toggleItemComplete: (id: string) => {
      sound.playToggle();
      const updated = globalState.shoppingList.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      globalState = { ...globalState, shoppingList: updated };
      notify();
    },

    removeShoppingItem: (id: string) => {
      sound.playPop();
      const updated = globalState.shoppingList.filter((item) => item.id !== id);
      globalState = { ...globalState, shoppingList: updated };
      notify();
    },

    updateBudgetLimits: (tripLimit: number, monthlyLimit: number) => {
      sound.playSuccess();
      globalState = {
        ...globalState,
        budget: { ...globalState.budget, tripLimit, monthlyLimit }
      };
      notify();
    },

    // CART OPERATIONS
    addItemToCart: (product: { name: string; category: string; price: number; unit: UnitType; shopId: string; shopName: string; savingsApplied?: number }) => {
      sound.playSuccess();
      const existing = globalState.cart.find((c) => c.name === product.name && c.shopId === product.shopId);
      let updatedCart: CartItem[];
      if (existing) {
        updatedCart = globalState.cart.map((c) =>
          c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        updatedCart = [
          ...globalState.cart,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1,
            unit: product.unit,
            shopId: product.shopId,
            shopName: product.shopName,
            savingsApplied: product.savingsApplied || 0,
          }
        ];
      }

      globalState = { ...globalState, cart: updatedCart };
      notify();
    },

    updateCartQuantity: (cartId: string, delta: number) => {
      sound.playPop();
      const item = globalState.cart.find((c) => c.id === cartId);
      if (!item) return;

      const newQty = item.quantity + delta;
      let updatedCart: CartItem[];
      if (newQty <= 0) {
        updatedCart = globalState.cart.filter((c) => c.id !== cartId);
      } else {
        updatedCart = globalState.cart.map((c) => (c.id === cartId ? { ...c, quantity: newQty } : c));
      }
      globalState = { ...globalState, cart: updatedCart };
      notify();
    },

    removeFromCart: (cartId: string) => {
      sound.playPop();
      globalState = { ...globalState, cart: globalState.cart.filter((c) => c.id !== cartId) };
      notify();
    },

    clearCart: () => {
      globalState = { ...globalState, cart: [] };
      notify();
    },

    // SIMULATED CHECKOUT
    placeOrder: () => {
      if (globalState.cart.length === 0) return null;
      sound.playSuccess();

      const subtotal = globalState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = globalState.cart.reduce((sum, item) => sum + (item.savingsApplied || 0) * item.quantity, 0);
      const deliveryFee = globalState.deliveryMode === 'delivery' && subtotal < 500 ? 35 : 0;
      const total = subtotal - discount + deliveryFee;

      const newOrder: CustomerOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `AQ-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: 'Just now',
        status: 'placed',
        items: [...globalState.cart],
        subtotal,
        discount,
        deliveryFee,
        total,
        deliveryType: globalState.deliveryMode,
        address: {
          pinCode: globalState.deliveryPinCode,
          street: '12/4 2nd Cross, HAL 2nd Stage',
          city: 'Bangalore'
        },
        shopName: globalState.cart[0]?.shopName || 'GreenMart Organics',
        estimatedDeliveryMin: 25,
      };

      // Also create a shop owner notification for incoming customer order
      const shopNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetRole: 'shop_owner',
        title: `New Order Received (${newOrder.orderNumber})`,
        message: `${globalState.user.name} ordered ${newOrder.items.length} items (₹${total}). Awaiting your confirmation!`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
        actionableId: newOrder.id,
      };

      globalState = {
        ...globalState,
        cart: [],
        orders: [newOrder, ...globalState.orders],
        notifications: [shopNotif, ...globalState.notifications],
        customerTab: 'cart',
      };
      notify();
      return newOrder;
    },

    // SIGNATURE DEMAND-TO-OFFER ENGINE:
    // Shop owner or Provider creates an offer directly responding to local customer demand!
    launchDemandOffer: (demandItem: DemandSignal, discountPercent: number = 15) => {
      sound.playSuccess();
      const newOffer: Offer = {
        id: `off-${Date.now()}`,
        title: `Flash ${discountPercent}% OFF ${demandItem.productName}`,
        description: `Community Demand Deal: Shop locally and save on neighbourhood requested ${demandItem.productName}`,
        discountPercent,
        code: `DEMAND${discountPercent}`,
        category: demandItem.category,
        shopId: 'shop-1',
        shopName: globalState.user.shopName || 'GreenMart Organics',
        validUntil: 'Today 10:00 PM',
        minSpend: 150,
        eligibleProductNames: [demandItem.productName],
        bannerColor: 'from-[#16834A] to-[#C8FF55]',
        isVerified: true,
        active: true,
        sponsorName: globalState.user.shopName || 'GreenMart Organics',
      };

      // Match with customer's current shopping list items
      const updatedShoppingList = globalState.shoppingList.map((item) => {
        if (
          item.name.toLowerCase().includes(demandItem.productName.toLowerCase()) ||
          demandItem.productName.toLowerCase().includes(item.name.toLowerCase())
        ) {
          return {
            ...item,
            matchedOfferId: newOffer.id,
            matchedOfferDiscount: discountPercent,
          };
        }
        return item;
      });

      // Send immediate high-priority notification to Customer!
      const customerNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetRole: 'customer',
        title: `Demand Matched: ${discountPercent}% OFF ${demandItem.productName}!`,
        message: `${newOffer.shopName} answered local demand with a special discount code ${newOffer.code}.`,
        timestamp: 'Just now',
        read: false,
        type: 'offer',
        actionableId: newOffer.id,
      };

      globalState = {
        ...globalState,
        offers: [newOffer, ...globalState.offers],
        shoppingList: updatedShoppingList,
        notifications: [customerNotif, ...globalState.notifications],
      };
      notify();
    },

    // SHOP OWNER ACTIONS
    updateShopOrderStatus: (orderId: string, newStatus: OrderStatus) => {
      sound.playToggle();
      const updatedOrders = globalState.orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      const targetOrder = globalState.orders.find((o) => o.id === orderId);
      const customerNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetRole: 'customer',
        title: `Order Status: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
        message: `Your order ${targetOrder?.orderNumber} is now ${newStatus.replace(/_/g, ' ')}.`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
        actionableId: orderId,
      };

      globalState = {
        ...globalState,
        orders: updatedOrders,
        notifications: [customerNotif, ...globalState.notifications]
      };
      notify();
    },

    updateInventoryStock: (id: string, newStock: number) => {
      sound.playPop();
      globalState = {
        ...globalState,
        shopInventory: globalState.shopInventory.map((i) =>
          i.id === id ? { ...i, stock: newStock, isAvailable: newStock > 0 } : i
        )
      };
      notify();
    },

    addInventoryItem: (item: Omit<ShopInventoryItem, 'id' | 'demandSignalsCount' | 'recentOrdersCount'>) => {
      sound.playSuccess();
      const newItem: ShopInventoryItem = {
        ...item,
        id: `inv-${Date.now()}`,
        demandSignalsCount: 12,
        recentOrdersCount: 4,
      };
      globalState = {
        ...globalState,
        shopInventory: [newItem, ...globalState.shopInventory]
      };
      notify();
    },

    // WHOLESALE ORDER PLACEMENT (FROM SHOP TO WHOLESALER)
    placeWholesaleOrder: (wholesaleItemId: string, quantity: number) => {
      sound.playSuccess();
      const item = globalState.wholesaleCatalog.find((w) => w.id === wholesaleItemId);
      if (!item) return;

      const tier = item.tierPricing.slice().reverse().find((t) => quantity >= t.minQty) || item.tierPricing[0];
      const unitPrice = tier.pricePerUnit;
      const totalAmount = unitPrice * quantity;

      const newWholesaleOrder: WholesaleOrder = {
        id: `wo-${Date.now()}`,
        orderNumber: `WS-${Math.floor(1000 + Math.random() * 9000)}`,
        retailerName: globalState.user.shopName || 'GreenMart Organics',
        shopLocation: 'Indiranagar 100ft Rd',
        items: [{ name: item.name, quantity, unit: item.unit, unitPrice }],
        totalAmount,
        status: 'confirmed',
        createdAt: 'Just now',
        deliveryDate: 'Tomorrow Morning',
      };

      const wholesaleNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetRole: 'wholesale',
        title: `New Bulk Order (${newWholesaleOrder.orderNumber})`,
        message: `${newWholesaleOrder.retailerName} ordered ${quantity}x ${item.name} (₹${totalAmount.toLocaleString()})`,
        timestamp: 'Just now',
        read: false,
        type: 'wholesale',
        actionableId: newWholesaleOrder.id,
      };

      globalState = {
        ...globalState,
        wholesaleOrders: [newWholesaleOrder, ...globalState.wholesaleOrders],
        notifications: [wholesaleNotif, ...globalState.notifications],
      };
      notify();
    },

    // OFFER PROVIDER CAMPAIGN CREATION
    createCampaign: (campaign: Omit<ProviderCampaign, 'id' | 'impressions' | 'clicks' | 'redemptions' | 'budgetSpent'>) => {
      sound.playSuccess();
      const newCmp: ProviderCampaign = {
        ...campaign,
        id: `cmp-${Date.now()}`,
        impressions: 0,
        clicks: 0,
        redemptions: 0,
        budgetSpent: 0,
      };

      // Also create corresponding live offer
      const brandOffer: Offer = {
        id: `off-${Date.now()}`,
        title: `${campaign.discountPercent}% OFF ${campaign.title}`,
        description: `Sponsored campaign by ${campaign.brandName}`,
        discountPercent: campaign.discountPercent,
        code: campaign.couponCode,
        category: campaign.category,
        shopName: 'All Partner Stores',
        validUntil: campaign.endDate,
        minSpend: 250,
        eligibleProductNames: [campaign.title, campaign.category],
        bannerColor: 'from-[#FF8A3D] to-[#0D3328]',
        isVerified: true,
        active: true,
        sponsorName: campaign.brandName,
      };

      globalState = {
        ...globalState,
        campaigns: [newCmp, ...globalState.campaigns],
        offers: [brandOffer, ...globalState.offers],
      };
      notify();
    },

    markNotificationRead: (id: string) => {
      globalState = {
        ...globalState,
        notifications: globalState.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      };
      notify();
    },

    clearAllNotifications: () => {
      globalState = { ...globalState, notifications: [] };
      notify();
    },

    resetToDemoState: () => {
      sound.playPop();
      globalState = {
        user: INITIAL_USER,
        currentRole: 'customer',
        isOnboarded: true,
        shoppingList: INITIAL_SHOPPING_LIST,
        budget: { tripLimit: 1000, monthlyLimit: 14000, spentThisMonth: 7850 },
        offers: INITIAL_OFFERS,
        shopInventory: INITIAL_INVENTORY,
        demandSignals: INITIAL_DEMAND_SIGNALS,
        cart: [],
        orders: INITIAL_ORDERS,
        wholesaleCatalog: INITIAL_WHOLESALE,
        wholesaleOrders: INITIAL_WHOLESALE_ORDERS,
        campaigns: INITIAL_CAMPAIGNS,
        notifications: INITIAL_NOTIFICATIONS,
        customerTab: 'list',
        shopTab: 'dashboard',
        wholesaleTab: 'catalog',
        providerTab: 'campaigns',
        deliveryMode: 'delivery',
        deliveryPinCode: '560038',
      };
      notify();
    }
  };
}
