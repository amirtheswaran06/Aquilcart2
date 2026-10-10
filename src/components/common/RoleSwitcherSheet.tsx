import React from 'react';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';
import { User, Store, Truck, Megaphone, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

interface RoleSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherSheet: React.FC<RoleSwitcherProps> = ({ isOpen, onClose }) => {
  const { state, setRole } = useAppStore();

  const roles: {
    id: UserRole;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    description: string;
  }[] = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shopping List & Budget Intelligence',
      icon: User,
      accentColor: 'text-[#C8FF55] border-[#C8FF55]/50 bg-[#C8FF55]/10',
      description: 'Create demand with grocery lists, monitor spending radar, compare local prices, and unlock matched flash discounts.',
    },
    {
      id: 'shop_owner',
      title: 'Shop Owner',
      subtitle: 'Demand Radar & Order Fulfillment',
      icon: Store,
      accentColor: 'text-[#FF8A3D] border-[#FF8A3D]/50 bg-[#FF8A3D]/10',
      description: 'See live aggregated demand around your store, launch target discounts, restock low inventory, and accept incoming customer orders.',
    },
    {
      id: 'wholesale',
      title: 'Wholesale Dealer',
      subtitle: 'Bulk Supply & Retailer Fulfillment',
      icon: Truck,
      accentColor: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10',
      description: 'Supply neighborhood stores with bulk grains and edible oils, set tiered wholesale pricing, and fulfill retailer requisitions.',
    },
    {
      id: 'offer_provider',
      title: 'Offer Provider',
      subtitle: 'Promotional Campaigns & Analytics',
      icon: Megaphone,
      accentColor: 'text-amber-300 border-amber-300/50 bg-amber-300/10',
      description: 'Run targeted coupon campaigns across partner stores, analyze impressions and redemptions, and scale brand awareness.',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    sound.playSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
          {/* Backdrop click to dismiss */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md bg-[#0D3328] border-t border-[#16834A]/50 rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            {/* Grab handle bar */}
            <div className="w-12 h-1 bg-[#16834A]/60 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">Select Ecosystem Role</h3>
                <p className="text-xs text-emerald-200/70">
                  Switch perspectives to test real-time cross-role demand synchronization
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#123E32] flex items-center justify-center text-emerald-300 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {roles.map((r) => {
                const isSelected = state.currentRole === r.id;
                const Icon = r.icon;

                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all touch-press flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#123E32] border-[#C8FF55] shadow-lg shadow-[#16834A]/20'
                        : 'bg-[#081E17]/80 border-[#16834A]/30 hover:border-[#16834A]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${r.accentColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-white">{r.title}</span>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[#C8FF55] text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4 fill-[#C8FF55] text-[#0D3328]" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-emerald-300/80 mb-1">{r.subtitle}</p>
                      <p className="text-[11px] text-emerald-100/60 leading-relaxed">{r.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#081E17] border border-[#16834A]/30 rounded-xl p-3 text-[11px] text-emerald-200/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8FF55] shrink-0" />
              <span>
                <strong>Connected Engine:</strong> Adding items in Customer updates Demand in Shop Owner; discounts created in Shop Owner alert Customers!
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
