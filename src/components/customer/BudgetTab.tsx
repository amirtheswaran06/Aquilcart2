import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';

export const BudgetTab: React.FC = () => {
  const { state, updateBudgetLimits } = useAppStore();

  const [tripLimitInput, setTripLimitInput] = useState(state.budget.tripLimit.toString());
  const [monthlyLimitInput, setMonthlyLimitInput] = useState(state.budget.monthlyLimit.toString());
  const [isEditing, setIsEditing] = useState(false);

  const plannedTrip = state.shoppingList.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const tripLimit = state.budget.tripLimit;
  const tripRemaining = Math.max(0, tripLimit - plannedTrip);
  const tripPercent = Math.min(100, Math.round((plannedTrip / tripLimit) * 100));

  const monthlySpent = state.budget.spentThisMonth;
  const monthlyLimit = state.budget.monthlyLimit;
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlySpent);
  const monthlyPercent = Math.min(100, Math.round((monthlySpent / monthlyLimit) * 100));

  // Category spending breakdown based on current shopping list
  const categoryTotals = state.shoppingList.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.estimatedPrice;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat,
    total,
    percent: plannedTrip > 0 ? Math.round((total / plannedTrip) * 100) : 0,
  }));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip = parseFloat(tripLimitInput) || 1000;
    const newMonthly = parseFloat(monthlyLimitInput) || 12000;
    updateBudgetLimits(newTrip, newMonthly);
    setIsEditing(false);
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#C8FF55] uppercase tracking-wider">
            Financial Health
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Budget Intelligence</h2>
        </div>
        <button
          onClick={() => {
            sound.playPop();
            setIsEditing(!isEditing);
          }}
          className="text-xs bg-[#123E32] text-[#C8FF55] border border-[#16834A]/50 px-3 py-1.5 rounded-xl font-bold touch-press"
        >
          {isEditing ? 'Cancel' : 'Set Limits'}
        </button>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveBudget}
          className="bg-[#0D3328] border border-[#C8FF55]/50 rounded-2xl p-4 space-y-3 shadow-xl"
        >
          <h3 className="font-display font-bold text-sm text-white">Update Spending Limits</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                Trip Target (₹)
              </label>
              <input
                type="number"
                value={tripLimitInput}
                onChange={(e) => setTripLimitInput(e.target.value)}
                className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">
                Monthly Target (₹)
              </label>
              <input
                type="number"
                value={monthlyLimitInput}
                onChange={(e) => setMonthlyLimitInput(e.target.value)}
                className="w-full bg-[#081E17] border border-[#16834A] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-md touch-press"
          >
            Apply Limits
          </button>
        </motion.form>
      )}

      {/* Hero Dual Budget Rings / Meters */}
      <div className="grid grid-cols-2 gap-3">
        {/* Per-Trip Meter */}
        <div className="bg-gradient-to-br from-[#0D3328] to-[#081E17] border border-[#16834A]/40 rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-300 mb-1">
              <span>Trip Budget</span>
              <span className="text-[#C8FF55] tabular-nums">{tripPercent}%</span>
            </div>
            <div className="text-xl font-display font-black text-white tabular-nums">
              ₹{plannedTrip}
              <span className="text-xs text-emerald-400 font-normal"> / ₹{tripLimit}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full bg-[#081E17] rounded-full overflow-hidden border border-[#16834A]/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tripPercent}%` }}
                className={`h-full rounded-full ${
                  tripPercent > 90 ? 'bg-[#FF8A3D]' : 'bg-[#C8FF55]'
                }`}
              />
            </div>
            <span className="text-[10px] text-emerald-300/70 block mt-1">
              ₹{tripRemaining} balance left
            </span>
          </div>
        </div>

        {/* Monthly Meter */}
        <div className="bg-gradient-to-br from-[#0D3328] to-[#081E17] border border-[#16834A]/40 rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-300 mb-1">
              <span>Monthly Radar</span>
              <span className="text-emerald-300 tabular-nums">{monthlyPercent}%</span>
            </div>
            <div className="text-xl font-display font-black text-white tabular-nums">
              ₹{monthlySpent.toLocaleString()}
              <span className="text-xs text-emerald-400 font-normal"> / ₹{monthlyLimit.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full bg-[#081E17] rounded-full overflow-hidden border border-[#16834A]/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${monthlyPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#16834A]"
              />
            </div>
            <span className="text-[10px] text-emerald-300/70 block mt-1">
              ₹{monthlyRemaining.toLocaleString()} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Safety Warning or Clean Advice Card */}
      {tripPercent > 85 ? (
        <div className="bg-[#3D1A0D] border border-[#FF8A3D] rounded-2xl p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF8A3D] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-xs text-white">Approaching Trip Limit</h4>
            <p className="text-[11px] text-orange-200/80 leading-relaxed mt-0.5">
              Your planned basket is at {tripPercent}% of your trip budget. Consider swapping 1–2 items for the cheaper alternatives below to stay comfortably under ₹{tripLimit}.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#081E17] border border-[#16834A]/40 rounded-2xl p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C8FF55] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-xs text-white">Spending On Track</h4>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed mt-0.5">
              Eagle Radar indicates healthy pacing. You have ₹{tripRemaining} cushion for pantry extras.
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#C8FF55]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Spending by Category
            </h3>
          </div>
          <span className="text-[10px] text-emerald-300/70">{categoryBreakdown.length} Categories</span>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">{item.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-300 font-mono">₹{item.total}</span>
                  <span className="text-[10px] text-emerald-400/80 font-bold tabular-nums">
                    ({item.percent}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[#081E17] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#16834A] to-[#C8FF55] rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Budget-Friendly Alternatives */}
      <div className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-[#C8FF55]" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
            Recommended Alternatives
          </h3>
        </div>

        <div className="space-y-2.5">
          <div className="bg-[#081E17] border border-[#16834A]/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-white font-medium block">Kisan Groundnut Oil 2L</span>
              <span className="text-[10px] text-emerald-300/70">Swap for Sunflower Oil</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-300 font-mono block">₹310</span>
              <span className="text-[9px] bg-emerald-950 text-[#C8FF55] font-bold px-1.5 py-0.5 rounded border border-[#C8FF55]/30">
                Save ₹50
              </span>
            </div>
          </div>

          <div className="bg-[#081E17] border border-[#16834A]/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-white font-medium block">Sona Masoori Premium 5kg</span>
              <span className="text-[10px] text-emerald-300/70">Swap for Royal Basmati</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-300 font-mono block">₹340</span>
              <span className="text-[9px] bg-emerald-950 text-[#C8FF55] font-bold px-1.5 py-0.5 rounded border border-[#C8FF55]/30">
                Save ₹110
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
