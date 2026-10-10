import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { EagleEmblem } from '../brand/EagleLogo';
import { MapPin, Bell, Layers, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';

interface MobileHeaderProps {
  onOpenNotifications: () => void;
  onOpenRoleSwitcher: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenNotifications,
  onOpenRoleSwitcher,
}) => {
  const { state, setDeliveryPinCode } = useAppStore();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState(state.deliveryPinCode);

  const unreadCount = state.notifications.filter(
    (n) => !n.read && (n.targetRole === state.currentRole || n.targetRole === 'all')
  ).length;

  const roleLabels = {
    customer: { label: 'Customer', color: 'text-[#C8FF55] border-[#C8FF55]/40 bg-[#C8FF55]/10' },
    shop_owner: { label: 'Shop Owner', color: 'text-[#FF8A3D] border-[#FF8A3D]/40 bg-[#FF8A3D]/10' },
    wholesale: { label: 'Wholesale Hub', color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' },
    offer_provider: { label: 'Offer Provider', color: 'text-amber-300 border-amber-300/40 bg-amber-300/10' },
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim()) {
      setDeliveryPinCode(pinInput.trim());
      sound.playSuccess();
      setShowPinModal(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0D3328]/95 backdrop-blur-md border-b border-[#16834A]/30 px-3.5 py-2.5 text-white">
        <div className="flex items-center justify-between gap-2">
          {/* Left Slot: Eagle Emblem & Role Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                onOpenRoleSwitcher();
              }}
              className="flex items-center gap-1.5 touch-press"
              aria-label="Switch User Role"
            >
              <div className="relative">
                <EagleEmblem size={30} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C8FF55] ring-2 ring-[#0D3328]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-extrabold text-xs tracking-tight text-white flex items-center gap-0.5">
                  AQUIL<span className="text-[#C8FF55]">CART</span>
                </span>
                <span
                  className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded border leading-tight ${roleLabels[state.currentRole].color}`}
                >
                  {roleLabels[state.currentRole].label}
                </span>
              </div>
            </button>
          </div>

          {/* Center Slot: Location & Pin Code */}
          <button
            onClick={() => {
              sound.playPop();
              setShowPinModal(true);
            }}
            className="flex items-center gap-1 bg-[#081E17] hover:bg-[#123E32] transition-colors px-2.5 py-1 rounded-full border border-[#16834A]/40 max-w-[130px] touch-press"
            title="Change Location & PIN Code"
          >
            <MapPin className="w-3 h-3 text-[#C8FF55] shrink-0" />
            <span className="text-[11px] font-medium truncate text-emerald-100">
              {state.deliveryPinCode === '560038' ? 'Indiranagar' : `PIN ${state.deliveryPinCode}`}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-400 shrink-0" />
          </button>

          {/* Right Slot: Role Switcher & Notifications */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playPop();
                onOpenRoleSwitcher();
              }}
              className="w-8 h-8 rounded-full bg-[#123E32] hover:bg-[#16834A]/40 flex items-center justify-center text-emerald-200 border border-[#16834A]/30 touch-press"
              title="Switch Experience Role"
              aria-label="Open Role Switcher"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onOpenNotifications();
              }}
              className="relative w-8 h-8 rounded-full bg-[#123E32] hover:bg-[#16834A]/40 flex items-center justify-center text-white border border-[#16834A]/30 touch-press"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#C8FF55]" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#FF8A3D] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md ring-2 ring-[#0D3328]"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PIN Code Editor Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#0D3328] border border-[#16834A] rounded-2xl p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C8FF55]" />
                <h3 className="font-display font-bold text-base text-white">Your Delivery PIN</h3>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-emerald-200/80 mb-4">
              Local shops, demand aggregation, and available flash discounts are calculated within your neighbourhood PIN code.
            </p>
            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                  Postal PIN Code (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] rounded-xl px-3 py-2 text-white font-mono text-base tracking-widest focus:outline-none"
                  placeholder="560038"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinInput('560038')}
                  className="text-[11px] px-2.5 py-1 bg-[#123E32] rounded-lg text-emerald-200 border border-[#16834A]/40 hover:border-[#C8FF55]"
                >
                  Indiranagar (560038)
                </button>
                <button
                  type="button"
                  onClick={() => setPinInput('560034')}
                  className="text-[11px] px-2.5 py-1 bg-[#123E32] rounded-lg text-emerald-200 border border-[#16834A]/40 hover:border-[#C8FF55]"
                >
                  Koramangala (560034)
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#C8FF55] text-[#0D3328] font-bold text-xs rounded-xl shadow-lg hover:bg-[#d8ff7a] transition-all touch-press"
              >
                Update Service Area
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};
