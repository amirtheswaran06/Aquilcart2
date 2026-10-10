import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  Truck,
  Package,
  Layers,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

export const WholesaleView: React.FC = () => {
  const { state, setWholesaleTab } = useAppStore();
  const [selectedWholesaleItem, setSelectedWholesaleItem] = useState<string | null>(null);

  const totalWholesaleRevenue = state.wholesaleOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            {state.user.businessName}
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Wholesale Supply Hub</h2>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/40 px-2 py-0.5 rounded-full">
          B2B AGRO SUPPLY
        </span>
      </div>

      {/* Wholesale Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'catalog', label: `Bulk Supply (${state.wholesaleCatalog.length})` },
          { id: 'orders', label: `Retailer Orders (${state.wholesaleOrders.length})` },
          { id: 'forecast', label: 'City Demand Forecast' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playPop();
              setWholesaleTab(tab.id as typeof state.wholesaleTab);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-press ${
              state.wholesaleTab === tab.id
                ? 'bg-emerald-400 text-[#081E17] font-bold shadow-md'
                : 'bg-[#081E17] text-emerald-200/80 border border-[#16834A]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW / CATALOG */}
      {state.wholesaleTab === 'catalog' && (
        <div className="space-y-3.5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3 shadow-md">
              <span className="text-[10px] text-emerald-300 uppercase block">Active Invoiced</span>
              <span className="font-display font-black text-lg text-white tabular-nums">
                ₹{totalWholesaleRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">2 verified stores</span>
            </div>
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3 shadow-md">
              <span className="text-[10px] text-emerald-300 uppercase block">Warehouse Stock</span>
              <span className="font-display font-black text-lg text-[#C8FF55] tabular-nums">
                1,330 Units
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">99.2% in stock</span>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-300 uppercase block">
            Bulk Products & Tiered Pricing
          </span>

          <div className="space-y-3">
            {state.wholesaleCatalog.map((item) => (
              <div
                key={item.id}
                className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{item.name}</h4>
                    <span className="text-[10px] text-emerald-300/70">
                      {item.category} · Minimum Order: {item.moq} {item.unit}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#123E32] text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    {item.stockAvailable} available
                  </span>
                </div>

                {/* Tiered Price Matrix */}
                <div className="bg-[#081E17] rounded-xl p-2.5 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Volume Tier Discounts
                  </span>
                  {item.tierPricing.map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] text-emerald-200"
                    >
                      <span>
                        Tier {idx + 1}: {tier.minQty}+ {item.unit}
                      </span>
                      <span className="font-mono font-bold text-white">
                        ₹{tier.pricePerUnit.toLocaleString()} / unit
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-1">
                  <span>Source: {item.supplierName}</span>
                  <span className="text-emerald-400 font-bold">Standard Delivery: 24h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RETAILER ORDERS STREAM */}
      {state.wholesaleTab === 'orders' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase block">
            Retailer Requisitions ({state.wholesaleOrders.length})
          </span>

          <div className="space-y-3">
            {state.wholesaleOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-sm text-white block">
                      {ord.retailerName}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-300/70">
                      Order {ord.orderNumber} · {ord.createdAt}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#123E32] text-emerald-300 border border-emerald-400/40">
                    {ord.status}
                  </span>
                </div>

                <div className="bg-[#081E17] p-2.5 rounded-xl space-y-1 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-emerald-200 text-[11px]">
                      <span>
                        {it.quantity}x {it.name}
                      </span>
                      <span className="font-mono">₹{it.unitPrice * it.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#16834A]/30 pt-1 flex justify-between font-bold text-white text-xs">
                    <span>Total Invoice</span>
                    <span className="text-[#C8FF55] font-mono">
                      ₹{ord.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-300/70">
                  <span>Fulfillment Slot: {ord.deliveryDate}</span>
                  <span className="text-emerald-400 font-bold">Verified Retailer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CITY DEMAND FORECAST */}
      {state.wholesaleTab === 'forecast' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-br from-[#123E32] to-[#0D3328] border border-emerald-400/40 rounded-2xl p-4 text-white shadow-xl">
            <h3 className="font-display font-bold text-sm text-white mb-1">
              Cross-District Agro Demand Forecast
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
              Aggregated from customer lists and shop replenishment trends across Bangalore East zones.
            </p>

            <div className="space-y-2.5">
              <div className="bg-[#081E17] p-3 rounded-xl border border-[#16834A]/30">
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Edible Oils (Sunflower & Groundnut)</span>
                  <span className="text-[#C8FF55]">+32% Surge</span>
                </div>
                <div className="h-1.5 w-full bg-[#0D3328] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C8FF55] w-[78%] rounded-full" />
                </div>
                <span className="text-[10px] text-emerald-300/70 block mt-1">
                  Projected local demand: 850L this week
                </span>
              </div>

              <div className="bg-[#081E17] p-3 rounded-xl border border-[#16834A]/30">
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Basmati Rice (Aged & Super Fine)</span>
                  <span className="text-emerald-400">+18% Steady</span>
                </div>
                <div className="h-1.5 w-full bg-[#0D3328] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[62%] rounded-full" />
                </div>
                <span className="text-[10px] text-emerald-300/70 block mt-1">
                  Projected local demand: 2.4 Tonnes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
