import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Offer } from '../../types';
import {
  Tag,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShoppingBag,
  Store,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';

export const OffersTab: React.FC = () => {
  const { state, addItemToCart, setCustomerTab } = useAppStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Pantry', 'Dairy', 'Produce'];

  const filteredOffers = state.offers.filter((o) => {
    if (selectedCategory === 'All') return true;
    return o.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleCopyCode = (code: string) => {
    sound.playPop();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyOfferToCart = (offer: Offer) => {
    sound.playSuccess();
    // Add primary eligible product with discount applied
    const productName = offer.eligibleProductNames[0] || 'Grocery Deal';
    const originalPrice = 200;
    const discountAmount = Math.round((originalPrice * offer.discountPercent) / 100);

    addItemToCart({
      name: productName,
      category: offer.category,
      price: originalPrice - discountAmount,
      unit: 'pack',
      shopId: offer.shopId || 'shop-1',
      shopName: offer.shopName,
      savingsApplied: discountAmount,
    });
    setCustomerTab('cart');
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#C8FF55] uppercase tracking-wider">
            Curated For You
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Flash Offers & Deals</h2>
        </div>
        <div className="flex items-center gap-1 bg-[#123E32] px-2.5 py-1 rounded-full border border-[#16834A]/40 text-xs text-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-[#C8FF55]" />
          <span>{state.offers.length} Active Deals</span>
        </div>
      </div>

      {/* Demand Matched Highlight Banner */}
      <div className="bg-gradient-to-r from-[#16834A] to-[#0D3328] border border-[#C8FF55]/40 rounded-2xl p-3.5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C8FF55] text-[#0D3328] px-2 py-0.5 rounded-full inline-block mb-1">
              Demand Match Engine
            </span>
            <h3 className="font-display font-bold text-sm text-white">
              Local Shops Are Responding
            </h3>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed mt-0.5">
              Discounts are tailored to what you and your neighbours put on your shopping lists this week.
            </p>
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playPop();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-press ${
              selectedCategory === cat
                ? 'bg-[#C8FF55] text-[#0D3328] shadow-md font-bold'
                : 'bg-[#081E17] text-emerald-200/80 border border-[#16834A]/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Offers Cards */}
      <div className="space-y-3">
        {filteredOffers.map((offer) => {
          const isMatched = state.shoppingList.some((item) =>
            offer.eligibleProductNames.some(
              (p) =>
                p.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(p.toLowerCase())
            )
          );

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Card Banner Header */}
              <div className={`bg-gradient-to-r ${offer.bannerColor} p-3 text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xl text-[#C8FF55] tabular-nums">
                    {offer.discountPercent}% OFF
                  </span>
                  {isMatched && (
                    <span className="text-[9px] bg-[#081E17] text-[#C8FF55] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#C8FF55]/50 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Matches Your List
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-200 bg-black/30 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-[#C8FF55]" />
                  <span>{offer.validUntil}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3.5 space-y-2.5">
                <div>
                  <h4 className="font-display font-bold text-sm text-white">{offer.title}</h4>
                  <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-1 border-t border-[#16834A]/20">
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3 text-[#FF8A3D]" />
                    <span>{offer.shopName}</span>
                  </span>
                  <span>Min. Spend: ₹{offer.minSpend || 100}</span>
                </div>

                {/* Bottom Actions: Coupon Code & Direct Claim */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="flex-1 bg-[#081E17] border border-[#16834A]/60 hover:border-[#C8FF55] rounded-xl px-2.5 py-2 flex items-center justify-between text-xs touch-press"
                  >
                    <span className="font-mono text-emerald-300 font-bold text-[11px] tracking-wider">
                      {offer.code}
                    </span>
                    {copiedCode === offer.code ? (
                      <span className="text-[#C8FF55] flex items-center gap-0.5 text-[10px] font-bold">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleApplyOfferToCart(offer)}
                    className="bg-[#C8FF55] text-[#0D3328] font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-[#d5ff7a] transition-all touch-press shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
