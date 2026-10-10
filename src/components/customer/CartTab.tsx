import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Truck,
  Store,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

export const CartTab: React.FC = () => {
  const {
    state,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    setDeliveryMode,
    setCustomerTab
  } = useAppStore();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = state.cart.reduce((sum, item) => sum + (item.savingsApplied || 0) * item.quantity, 0);
  const deliveryFee = state.deliveryMode === 'delivery' ? (subtotal >= 500 ? 0 : 35) : 0;
  const grandTotal = Math.max(0, subtotal - totalSavings + deliveryFee);

  const handleCheckout = () => {
    sound.playSuccess();
    const order = placeOrder();
    if (order) {
      setCreatedOrderNumber(order.orderNumber);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#C8FF55] uppercase tracking-wider">
            Checkout Basket
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">My Cart</h2>
        </div>
        {state.cart.length > 0 && (
          <button
            onClick={() => {
              sound.playPop();
              clearCart();
            }}
            className="text-xs text-emerald-300 hover:text-red-400 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {state.cart.length === 0 ? (
        <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-3xl p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#123E32] flex items-center justify-center mx-auto border border-[#16834A]/50">
            <ShoppingBag className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-white">Your Cart is Empty</h3>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto">
              Add items from your shopping list or claim flash deals to complete your order.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              setCustomerTab('list');
            }}
            className="py-2.5 px-5 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-lg hover:bg-[#d5ff7a] transition-all touch-press inline-flex items-center gap-1.5"
          >
            <span>Back to Shopping List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* Shop Header / Order Grouping */}
          <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#123E32] flex items-center justify-center border border-[#16834A]/40">
                <Store className="w-4 h-4 text-[#FF8A3D]" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-white block">
                  {state.cart[0]?.shopName || 'GreenMart Organics'}
                </span>
                <span className="text-[10px] text-emerald-300/70">
                  Partner Fulfilment Store · 0.8 km
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#123E32] text-[#C8FF55] px-2 py-0.5 rounded-full border border-[#16834A]/40 font-mono">
              {state.cart.length} items
            </span>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2.5">
            {state.cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#081E17] border border-[#16834A]/40 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-display font-bold text-xs text-white truncate">{item.name}</h4>
                  <span className="text-[10px] text-emerald-300/70 block">
                    {item.category} · ₹{item.price} / {item.unit}
                  </span>
                  {item.savingsApplied ? (
                    <span className="text-[9px] text-[#C8FF55] font-bold">
                      Saved ₹{item.savingsApplied * item.quantity} with offer
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#0D3328] border border-[#16834A]/60 rounded-xl px-1.5 py-0.5 gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-emerald-200 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white font-mono tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-emerald-200 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-display font-black text-xs text-white font-mono tabular-nums min-w-[50px] text-right">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fulfilment Toggle: Delivery vs Pickup */}
          <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              Fulfilment Method
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all touch-press ${
                  state.deliveryMode === 'delivery'
                    ? 'bg-[#123E32] border-[#C8FF55] text-white'
                    : 'bg-[#081E17] border-[#16834A]/30 text-emerald-200/70'
                }`}
              >
                <Truck className="w-4 h-4 text-[#C8FF55]" />
                <div>
                  <span className="font-display font-bold text-xs block">Home Delivery</span>
                  <span className="text-[10px] text-emerald-300/70">25–35 mins</span>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all touch-press ${
                  state.deliveryMode === 'pickup'
                    ? 'bg-[#123E32] border-[#C8FF55] text-white'
                    : 'bg-[#081E17] border-[#16834A]/30 text-emerald-200/70'
                }`}
              >
                <Store className="w-4 h-4 text-[#FF8A3D]" />
                <div>
                  <span className="font-display font-bold text-xs block">Store Pickup</span>
                  <span className="text-[10px] text-emerald-300/70">Ready in 15 mins</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8FF55] shrink-0" />
              <span className="truncate">
                Delivering to: 12/4 2nd Cross, Indiranagar ({state.deliveryPinCode})
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              Simulated Payment (Demo Mode)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['upi', 'card', 'cod'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-1 text-center rounded-xl border text-[11px] font-bold uppercase transition-all touch-press ${
                    paymentMethod === m
                      ? 'bg-[#123E32] border-[#C8FF55] text-[#C8FF55]'
                      : 'bg-[#081E17] border-[#16834A]/30 text-emerald-200/60'
                  }`}
                >
                  {m === 'upi' ? 'UPI / GPay' : m === 'card' ? 'Card' : 'Cash on Delivery'}
                </button>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between text-xs text-emerald-200/80">
              <span>Item Subtotal</span>
              <span className="font-mono">₹{subtotal}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-xs text-[#C8FF55] font-semibold">
                <span>Offer Discounts</span>
                <span className="font-mono">-₹{totalSavings}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-emerald-200/80">
              <span>Delivery Fee</span>
              <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-[#16834A]/30 flex justify-between items-center text-sm font-bold text-white">
              <span>To Pay</span>
              <span className="font-display font-black text-lg text-[#C8FF55] font-mono tabular-nums">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={handleCheckout}
            className="w-full py-3.5 bg-gradient-to-r from-[#C8FF55] to-[#a2ee20] text-[#0D3328] font-display font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C8FF55]/20 flex items-center justify-center gap-2 hover:brightness-105 transition-all touch-press"
          >
            <span>Confirm & Place Order (₹{grandTotal})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Recent Orders Stream */}
      {state.orders.length > 0 && (
        <div className="pt-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Recent Orders & Live Status
          </span>
          {state.orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3.5 space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                  <span className="text-[10px] text-emerald-300/70 block">{ord.createdAt}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#123E32] text-[#C8FF55] border border-[#C8FF55]/40">
                  {ord.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-200/80 pt-1 border-t border-[#16834A]/20">
                <span>{ord.items.length} items from {ord.shopName}</span>
                <span className="font-mono font-bold text-white">₹{ord.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Order Confirmation Celebration Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#0D3328] to-[#081E17] border-2 border-[#C8FF55] rounded-3xl p-6 text-center text-white shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-full bg-[#123E32] border-2 border-[#C8FF55] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C8FF55]/20">
                <CheckCircle2 className="w-10 h-10 text-[#C8FF55]" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8FF55] bg-[#123E32] px-3 py-1 rounded-full border border-[#16834A] inline-block mb-2">
                Order Confirmed
              </span>

              <h3 className="font-display font-black text-2xl text-white mb-1">
                Eagle Flight Dispatched!
              </h3>
              <p className="font-mono text-xs text-emerald-300 mb-3">
                Order ID: {createdOrderNumber}
              </p>

              <p className="text-xs text-emerald-200/80 leading-relaxed mb-5">
                Your order is sent to <strong>GreenMart Organics</strong>. The store has received your notification and will prepare your package in ~20 minutes.
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-lg hover:bg-[#d5ff7a] transition-all touch-press"
              >
                Track In Orders
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
