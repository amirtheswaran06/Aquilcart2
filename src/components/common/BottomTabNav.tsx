import React from 'react';
import { useAppStore } from '../../store/appStore';
import {
  ListTodo,
  PieChart,
  Tag,
  ShoppingBag,
  Store,
  Radar,
  Package,
  ClipboardList,
  Truck,
  TrendingUp,
  Megaphone,
  BarChart3,
  Network
} from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';

interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomTabNav: React.FC = () => {
  const {
    state,
    setCustomerTab,
    setShopTab,
    setWholesaleTab,
    setProviderTab
  } = useAppStore();

  const cartTotalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render role-specific navigation tabs
  if (state.currentRole === 'customer') {
    const tabs: TabItem<'list' | 'budget' | 'offers' | 'cart'>[] = [
      { id: 'list', label: 'My List', icon: ListTodo },
      { id: 'budget', label: 'Budget', icon: PieChart },
      { id: 'offers', label: 'Offers', icon: Tag },
      { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartTotalItems },
    ];

    return (
      <nav
        aria-label="Customer Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D3328]/95 backdrop-blur-xl border-t border-[#16834A]/30 pb-safe shadow-2xl"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = state.customerTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setCustomerTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors touch-press ${
                  isActive ? 'text-[#C8FF55]' : 'text-emerald-200/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute -top-[1px] w-12 h-1 bg-gradient-to-r from-[#16834A] via-[#C8FF55] to-[#16834A] rounded-full shadow-[0_0_8px_#C8FF55]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2.5 bg-[#FF8A3D] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md ring-2 ring-[#0D3328]"
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                </div>

                <span className={`text-[11px] font-semibold tracking-tight mt-1 ${isActive ? 'text-[#C8FF55]' : 'text-emerald-200/70'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  if (state.currentRole === 'shop_owner') {
    const tabs: TabItem<'dashboard' | 'demand' | 'inventory' | 'orders'>[] = [
      { id: 'dashboard', label: 'Overview', icon: Store },
      { id: 'demand', label: 'Demand Radar', icon: Radar, badge: state.demandSignals.length },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'orders', label: 'Orders', icon: ClipboardList, badge: state.orders.filter(o => o.status === 'placed').length },
    ];

    return (
      <nav
        aria-label="Shop Owner Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#081E17]/95 backdrop-blur-xl border-t border-[#FF8A3D]/30 pb-safe shadow-2xl"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = state.shopTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setShopTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors touch-press ${
                  isActive ? 'text-[#FF8A3D]' : 'text-emerald-200/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeShopTabPill"
                    className="absolute -top-[1px] w-12 h-1 bg-[#FF8A3D] rounded-full shadow-[0_0_8px_#FF8A3D]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#C8FF55] text-[#0D3328] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md ring-2 ring-[#081E17]">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isActive ? 'text-[#FF8A3D]' : 'text-emerald-200/70'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  if (state.currentRole === 'wholesale') {
    const tabs: TabItem<'catalog' | 'orders' | 'forecast'>[] = [
      { id: 'catalog', label: 'Bulk Supply', icon: Truck },
      { id: 'orders', label: 'Retail Orders', icon: ClipboardList, badge: state.wholesaleOrders.length },
      { id: 'forecast', label: 'City Forecast', icon: TrendingUp },
    ];

    return (
      <nav
        aria-label="Wholesale Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#081E17]/95 backdrop-blur-xl border-t border-emerald-500/30 pb-safe shadow-2xl"
      >
        <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = state.wholesaleTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setWholesaleTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors touch-press ${
                  isActive ? 'text-emerald-400' : 'text-emerald-200/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeWholesaleTabPill"
                    className="absolute -top-[1px] w-14 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#C8FF55] text-[#0D3328] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md ring-2 ring-[#081E17]">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[11px] font-semibold tracking-tight mt-1 ${isActive ? 'text-emerald-300' : 'text-emerald-200/70'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Offer Provider
  const tabs: TabItem<'campaigns' | 'analytics' | 'network'>[] = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, badge: state.campaigns.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'network', label: 'Partner Stores', icon: Network },
  ];

  return (
    <nav
      aria-label="Offer Provider Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#081E17]/95 backdrop-blur-xl border-t border-amber-400/30 pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = state.providerTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setProviderTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors touch-press ${
                isActive ? 'text-amber-300' : 'text-emerald-200/60 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeProviderTabPill"
                  className="absolute -top-[1px] w-14 h-1 bg-amber-300 rounded-full shadow-[0_0_8px_#FCD34D]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#C8FF55] text-[#0D3328] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md ring-2 ring-[#081E17]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] font-semibold tracking-tight mt-1 ${isActive ? 'text-amber-200' : 'text-emerald-200/70'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
