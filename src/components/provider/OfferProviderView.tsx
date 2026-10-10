import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { ProviderCampaign } from '../../types';
import {
  Megaphone,
  BarChart3,
  Network,
  Plus,
  Play,
  Pause,
  Eye,
  MousePointerClick,
  CheckCircle2,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

export const OfferProviderView: React.FC = () => {
  const { state, createCampaign, setProviderTab } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Campaign Form state
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignCategory, setCampaignCategory] = useState('Dairy');
  const [campaignDiscount, setCampaignDiscount] = useState('20');
  const [campaignCode, setCampaignCode] = useState('TASTE20');
  const [campaignBudget, setCampaignBudget] = useState('50000');

  const totalImpressions = state.campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalRedemptions = state.campaigns.reduce((sum, c) => sum + c.redemptions, 0);
  const totalSpent = state.campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) return;

    createCampaign({
      title: campaignTitle.trim(),
      brandName: state.user.organizationName || 'Heritage Foods',
      category: campaignCategory,
      couponCode: campaignCode.toUpperCase(),
      discountPercent: parseInt(campaignDiscount) || 15,
      budgetLimit: parseFloat(campaignBudget) || 30000,
      participatingShopsCount: 18,
      status: 'active',
      startDate: 'Today',
      endDate: 'In 14 Days',
    });

    setCampaignTitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            {state.user.organizationName}
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Brand Campaign Hub</h2>
        </div>
        <button
          onClick={() => {
            sound.playPop();
            setShowCreateModal(true);
          }}
          className="py-1.5 px-3 bg-amber-400 text-[#081E17] font-bold text-xs rounded-xl flex items-center gap-1 touch-press"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'campaigns', label: `Campaigns (${state.campaigns.length})` },
          { id: 'analytics', label: 'Live Analytics' },
          { id: 'network', label: 'Partner Grocers (24)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playPop();
              setProviderTab(tab.id as typeof state.providerTab);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-press ${
              state.providerTab === tab.id
                ? 'bg-amber-400 text-[#081E17] font-bold shadow-md'
                : 'bg-[#081E17] text-emerald-200/80 border border-[#16834A]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CAMPAIGNS TAB */}
      {state.providerTab === 'campaigns' && (
        <div className="space-y-3.5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-2.5">
              <span className="text-[9px] text-emerald-300 uppercase block">Impressions</span>
              <span className="font-display font-black text-sm text-white tabular-nums">
                {totalImpressions.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-2.5">
              <span className="text-[9px] text-emerald-300 uppercase block">Redeemed</span>
              <span className="font-display font-black text-sm text-[#C8FF55] tabular-nums">
                {totalRedemptions.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-2.5">
              <span className="text-[9px] text-emerald-300 uppercase block">Budget Spent</span>
              <span className="font-display font-black text-sm text-amber-300 tabular-nums">
                ₹{totalSpent.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {state.campaigns.map((camp) => {
              const percentUsed = Math.min(100, Math.round((camp.budgetSpent / camp.budgetLimit) * 100));

              return (
                <div
                  key={camp.id}
                  className="bg-[#0D3328] border border-[#16834A]/50 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">{camp.title}</h4>
                      <span className="text-[10px] text-emerald-300/70">
                        Code: <strong className="text-white font-mono">{camp.couponCode}</strong> · {camp.discountPercent}% OFF
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-400/40">
                      {camp.status}
                    </span>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-emerald-300">
                      <span>Budget Utilized</span>
                      <span className="font-mono">
                        ₹{camp.budgetSpent.toLocaleString()} / ₹{camp.budgetLimit.toLocaleString()} ({percentUsed}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#081E17] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[#C8FF55] rounded-full"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-[#081E17] p-2 rounded-xl text-center text-[11px]">
                    <div>
                      <span className="text-[9px] text-emerald-400/70 block">Views</span>
                      <span className="font-mono text-white font-bold">{camp.impressions}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-400/70 block">Clicks</span>
                      <span className="font-mono text-white font-bold">{camp.clicks}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-400/70 block">Claims</span>
                      <span className="font-mono text-[#C8FF55] font-bold">{camp.redemptions}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-emerald-300/70 pt-1">
                    <span>Enrolled in {camp.participatingShopsCount} shops</span>
                    <span>Valid: {camp.startDate} – {camp.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {state.providerTab === 'analytics' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-br from-[#123E32] to-[#0D3328] border border-amber-300/30 rounded-2xl p-4 text-white shadow-xl">
            <h3 className="font-display font-bold text-sm text-white mb-1">
              Campaign Conversion Funnel
            </h3>
            <p className="text-xs text-emerald-200/80 mb-3">
              Real-time conversion tracking across verified retail checkouts.
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-[#081E17] p-2.5 rounded-xl flex justify-between items-center">
                <span>1. Offer Seen in Shopping List</span>
                <span className="font-mono font-bold text-white">11,050 views (100%)</span>
              </div>
              <div className="bg-[#081E17] p-2.5 rounded-xl flex justify-between items-center">
                <span>2. Added to Cart with Discount</span>
                <span className="font-mono font-bold text-amber-300">3,510 items (31.7%)</span>
              </div>
              <div className="bg-[#081E17] p-2.5 rounded-xl flex justify-between items-center">
                <span>3. Completed Checkout</span>
                <span className="font-mono font-bold text-[#C8FF55]">1,228 orders (11.1%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER GROCERS NETWORK */}
      {state.providerTab === 'network' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase block">
            Enrolled Grocery Partners in 560038
          </span>

          <div className="space-y-2">
            {[
              { name: 'GreenMart Organics', loc: 'Indiranagar 100ft Rd', activeDeals: 3 },
              { name: 'Daily SuperBazaar', loc: 'Koramangala 4th Block', activeDeals: 2 },
              { name: 'Heritage Fresh Stores', loc: 'CMH Road Indiranagar', activeDeals: 4 },
            ].map((shop, i) => (
              <div
                key={i}
                className="bg-[#0D3328] border border-[#16834A]/40 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-bold text-xs text-white">{shop.name}</h4>
                  <span className="text-[10px] text-emerald-300/70">{shop.loc}</span>
                </div>
                <span className="text-[10px] bg-[#123E32] text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  {shop.activeDeals} Deals Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0D3328] border-2 border-amber-400 rounded-3xl p-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-extrabold text-base text-white">
                  Create Brand Campaign
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g. Organic Almond Milk Promo"
                    className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={campaignCode}
                      onChange={(e) => setCampaignCode(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs font-mono uppercase focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={campaignDiscount}
                      onChange={(e) => setCampaignDiscount(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                    Campaign Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(e.target.value)}
                    className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 text-[#081E17] font-bold text-xs rounded-xl shadow-lg hover:brightness-105 touch-press"
                >
                  Publish Campaign to Partner Stores
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
