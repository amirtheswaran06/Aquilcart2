import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { DemandSignal, ShopInventoryItem, OrderStatus, UnitType } from '../../types';
import {
  Store,
  Radar,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
  Check,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

export const ShopOwnerView: React.FC = () => {
  const {
    state,
    launchDemandOffer,
    updateInventoryStock,
    addInventoryItem,
    updateShopOrderStatus,
    placeWholesaleOrder,
    setShopTab,
  } = useAppStore();

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [targetDemandOffer, setTargetDemandOffer] = useState<DemandSignal | null>(null);
  const [offerDiscountPercent, setOfferDiscountPercent] = useState('15');

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Pantry');
  const [newProdPrice, setNewProdPrice] = useState('65');
  const [newProdUnit, setNewProdUnit] = useState<UnitType>('kg');
  const [newProdStock, setNewProdStock] = useState('50');

  const pendingOrders = state.orders.filter((o) => o.status === 'placed' || o.status === 'preparing');
  const lowStockItems = state.shopInventory.filter((i) => i.stock <= i.minStockThreshold);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDemandOffer) return;
    const discount = parseInt(offerDiscountPercent) || 15;
    launchDemandOffer(targetDemandOffer, discount);
    setTargetDemandOffer(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addInventoryItem({
      name: newProdName.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 50,
      unit: newProdUnit,
      stock: parseInt(newProdStock) || 20,
      minStockThreshold: 10,
      isAvailable: true,
    });

    setNewProdName('');
    setShowAddProductModal(false);
  };

  // Render sub-tabs for Shop Owner
  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Shop Owner Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#FF8A3D] uppercase tracking-wider">
            {state.user.shopName}
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Store Command Hub</h2>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF8A3D] bg-[#FF8A3D]/10 border border-[#FF8A3D]/40 px-2 py-0.5 rounded-full">
          DEMO ANALYTICS · LIVE
        </span>
      </div>

      {/* Top Navigation Pills for Shop Views */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'dashboard', label: 'Overview' },
          { id: 'demand', label: `Demand Radar (${state.demandSignals.length})` },
          { id: 'inventory', label: `Inventory (${lowStockItems.length} low)` },
          { id: 'orders', label: `Orders (${pendingOrders.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setShopTab(tab.id as typeof state.shopTab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-press ${
              state.shopTab === tab.id
                ? 'bg-[#FF8A3D] text-[#081E17] font-bold shadow-md'
                : 'bg-[#081E17] text-emerald-200/80 border border-[#16834A]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {state.shopTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Today's Sales KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] text-emerald-300 uppercase block">Today's Revenue</span>
              <span className="font-display font-black text-xl text-white tabular-nums">
                ₹18,450
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                +14% vs yesterday
              </span>
            </div>

            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] text-emerald-300 uppercase block">Active Orders</span>
              <span className="font-display font-black text-xl text-[#FF8A3D] tabular-nums">
                {pendingOrders.length} Pending
              </span>
              <span className="text-[10px] text-emerald-300/70 mt-1 block">
                Avg prep: 14 mins
              </span>
            </div>
          </div>

          {/* SIGNATURE DEMAND CALLOUT ON DASHBOARD */}
          <div className="bg-gradient-to-br from-[#123E32] to-[#0D3328] border border-[#FF8A3D]/40 rounded-2xl p-4 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-[#FF8A3D]" />
                <h3 className="font-display font-bold text-sm text-white">Demand Around Your Shop</h3>
              </div>
              <span className="text-[10px] bg-[#FF8A3D]/20 text-[#FF8A3D] px-2 py-0.5 rounded-full font-bold">
                PIN 560038
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 mb-3">
              Aggregated from {state.demandSignals.reduce((acc, s) => acc + s.customerCount, 0)} local grocery shopping lists in your immediate radius.
            </p>

            <div className="space-y-2 mb-3">
              {state.demandSignals.slice(0, 3).map((sig) => (
                <div
                  key={sig.id}
                  className="bg-[#081E17] border border-[#16834A]/40 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{sig.productName}</span>
                    <span className="text-[10px] text-emerald-300/70">
                      {sig.customerCount} customers asking for {sig.totalRequestedUnits} {sig.unit}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#C8FF55] bg-[#123E32] px-2 py-0.5 rounded-full">
                    {sig.trend}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShopTab('demand')}
              className="w-full py-2 bg-[#FF8A3D] text-[#081E17] font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md touch-press"
            >
              <span>Explore Demand & Launch Flash Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <div className="bg-[#3D1A0D] border border-[#FF8A3D] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A3D]">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Inventory Warning ({lowStockItems.length} items)</span>
              </div>
              <div className="space-y-1.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-white">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-300 font-mono">
                        {item.stock} {item.unit} left
                      </span>
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          placeWholesaleOrder('ws-1', 5);
                        }}
                        className="text-[10px] bg-[#FF8A3D] text-[#0D3328] font-bold px-2 py-0.5 rounded"
                      >
                        Order Wholesale
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DEMAND RADAR (SIGNATURE CROSS-ROLE FEATURE) */}
      {state.shopTab === 'demand' && (
        <div className="space-y-3.5">
          <div className="bg-[#081E17] border border-[#16834A]/40 rounded-2xl p-3 text-xs text-emerald-200/80 leading-relaxed">
            <strong className="text-white block mb-0.5">Privacy-Safe Demand Aggregation</strong>
            Shopper names are protected. Only aggregated quantities from confirmed shopping lists within PIN {state.deliveryPinCode} appear below. Launch a deal to notify all shoppers instantly!
          </div>

          <div className="space-y-3">
            {state.demandSignals.map((demand) => (
              <div
                key={demand.id}
                className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{demand.productName}</h4>
                    <span className="text-[10px] text-emerald-300/70">{demand.category} · PIN {demand.pinCode}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#123E32] text-[#C8FF55] px-2 py-0.5 rounded-full border border-[#C8FF55]/30">
                    {demand.trend} Demand
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#081E17] p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300/70 block uppercase">Requested Volume</span>
                    <span className="font-display font-black text-white">
                      {demand.totalRequestedUnits} {demand.unit}
                    </span>
                  </div>
                  <div className="border-l border-[#16834A]/30">
                    <span className="text-[10px] text-emerald-300/70 block uppercase">Shoppers Planning</span>
                    <span className="font-display font-black text-[#FF8A3D]">
                      {demand.customerCount} Active Lists
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      sound.playPop();
                      setTargetDemandOffer(demand);
                    }}
                    className="flex-1 py-2 bg-[#FF8A3D] text-[#081E17] font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md touch-press"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Launch Flash Deal</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playSuccess();
                      placeWholesaleOrder('ws-1', 10);
                    }}
                    className="px-3 py-2 bg-[#123E32] text-emerald-200 border border-[#16834A]/40 font-bold text-xs rounded-xl hover:text-white touch-press"
                  >
                    Restock Bulk
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY MANAGEMENT */}
      {state.shopTab === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase">
              Catalogue Items ({state.shopInventory.length})
            </span>
            <button
              onClick={() => {
                sound.playPop();
                setShowAddProductModal(true);
              }}
              className="py-1.5 px-3 bg-[#FF8A3D] text-[#081E17] font-bold text-xs rounded-xl flex items-center gap-1 touch-press"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {state.shopInventory.map((item) => (
              <div
                key={item.id}
                className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3 flex items-center justify-between shadow-md"
              >
                <div>
                  <h4 className="font-display font-bold text-xs text-white">{item.name}</h4>
                  <span className="text-[10px] text-emerald-300/70">
                    ₹{item.price} / {item.unit} · {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        item.stock <= item.minStockThreshold
                          ? 'bg-red-950 text-red-300 border border-red-500/40'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {item.stock} in stock
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateInventoryStock(item.id, Math.max(0, item.stock - 5))}
                    className="w-7 h-7 rounded-lg bg-[#081E17] border border-[#16834A]/50 text-white font-bold text-xs"
                    title="Deduct 5"
                  >
                    -5
                  </button>
                  <span className="font-mono text-xs font-bold text-white tabular-nums min-w-[24px] text-center">
                    {item.stock}
                  </span>
                  <button
                    onClick={() => updateInventoryStock(item.id, item.stock + 10)}
                    className="w-7 h-7 rounded-lg bg-[#081E17] border border-[#16834A]/50 text-white font-bold text-xs"
                    title="Add 10"
                  >
                    +10
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS FULFILLMENT */}
      {state.shopTab === 'orders' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase block">
            Customer Orders Pipeline
          </span>

          {state.orders.length === 0 ? (
            <div className="bg-[#081E17] border border-[#16834A]/30 rounded-2xl p-6 text-center text-xs text-emerald-200">
              No orders placed yet. Switch to Customer role and checkout a cart to see incoming orders here!
            </div>
          ) : (
            <div className="space-y-3">
              {state.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-white">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-emerald-300/70 block">{ord.createdAt}</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#123E32] text-[#FF8A3D] border border-[#FF8A3D]/40">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="bg-[#081E17] p-2 rounded-xl space-y-1 text-xs">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-emerald-200/90 text-[11px]">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#16834A]/30 pt-1 flex justify-between font-bold text-white text-xs">
                      <span>Total Paid</span>
                      <span className="text-[#C8FF55] font-mono">₹{ord.total}</span>
                    </div>
                  </div>

                  {/* Status Progression Buttons */}
                  <div className="flex gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                    {ord.status === 'placed' && (
                      <button
                        onClick={() => updateShopOrderStatus(ord.id, 'preparing')}
                        className="flex-1 py-1.5 bg-[#FF8A3D] text-[#0D3328] font-bold text-xs rounded-xl shadow-sm"
                      >
                        Accept & Start Preparing
                      </button>
                    )}
                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => updateShopOrderStatus(ord.id, 'out_for_delivery')}
                        className="flex-1 py-1.5 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-sm"
                      >
                        Dispatch / Ready for Delivery
                      </button>
                    )}
                    {ord.status === 'out_for_delivery' && (
                      <button
                        onClick={() => updateShopOrderStatus(ord.id, 'delivered')}
                        className="flex-1 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {ord.status === 'delivered' && (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mx-auto">
                        <Check className="w-3.5 h-3.5" /> Fulfilled Successfully
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Target Demand Flash Deal Modal */}
      <AnimatePresence>
        {targetDemandOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0D3328] border-2 border-[#FF8A3D] rounded-3xl p-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#FF8A3D]" />
                  <h3 className="font-display font-extrabold text-base text-white">
                    Launch Flash Offer
                  </h3>
                </div>
                <button
                  onClick={() => setTargetDemandOffer(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">
                Respond to <strong>{targetDemandOffer.customerCount} local shoppers</strong> requesting{' '}
                <strong>{targetDemandOffer.productName}</strong>. This offer will immediately badge their shopping lists!
              </p>

              <form onSubmit={handleCreateOffer} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                    Discount Percentage
                  </label>
                  <select
                    value={offerDiscountPercent}
                    onChange={(e) => setOfferDiscountPercent(e.target.value)}
                    className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#FF8A3D] rounded-xl px-3 py-2 text-white text-sm"
                  >
                    <option value="10">10% OFF Community Flash</option>
                    <option value="15">15% OFF (Recommended for Oil/Rice)</option>
                    <option value="20">20% OFF Clearance Deal</option>
                    <option value="25">25% OFF Super Weekend</option>
                  </select>
                </div>

                <div className="bg-[#081E17] p-2.5 rounded-xl border border-[#16834A]/40 text-xs text-emerald-300/80">
                  <span>Validity: </span>
                  <strong className="text-white">Active for next 8 hours in PIN {targetDemandOffer.pinCode}</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF8A3D] text-[#081E17] font-bold text-xs rounded-xl shadow-lg hover:brightness-105 touch-press"
                >
                  Publish & Notify Local Shoppers
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0D3328] border border-[#16834A] rounded-3xl p-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-extrabold text-base text-white">Add Shop Inventory</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Kashmiri Walnuts 500g"
                    className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                      Retail Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-md touch-press"
                >
                  Save to Inventory
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
