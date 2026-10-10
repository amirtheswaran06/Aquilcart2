import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Bell, Tag, Radar, ShoppingBag, CheckCheck, Trash2, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { state, markNotificationRead, clearAllNotifications, setCustomerTab, setShopTab } = useAppStore();

  const currentRoleNotifications = state.notifications.filter(
    (n) => n.targetRole === state.currentRole || n.targetRole === 'all'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Tag className="w-4 h-4 text-[#C8FF55]" />;
      case 'demand':
        return <Radar className="w-4 h-4 text-[#FF8A3D]" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#C8FF55]" />;
    }
  };

  const handleNotificationClick = (notifId: string, type: string) => {
    sound.playPop();
    markNotificationRead(notifId);
    if (state.currentRole === 'customer') {
      if (type === 'offer') setCustomerTab('offers');
      if (type === 'order') setCustomerTab('cart');
      if (type === 'budget') setCustomerTab('budget');
    } else if (state.currentRole === 'shop_owner') {
      if (type === 'demand') setShopTab('demand');
      if (type === 'order') setShopTab('orders');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md bg-[#0D3328] border-t border-[#16834A]/50 rounded-t-3xl p-5 text-white max-h-[85vh] flex flex-col shadow-2xl"
          >
            {/* Grab handle */}
            <div className="w-12 h-1 bg-[#16834A]/60 rounded-full mx-auto mb-3 shrink-0" />

            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C8FF55]" />
                <h3 className="font-display font-extrabold text-lg text-white">Notifications</h3>
                <span className="text-xs bg-[#123E32] text-emerald-200 px-2 py-0.5 rounded-full border border-[#16834A]/40 font-mono">
                  {currentRoleNotifications.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentRoleNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      clearAllNotifications();
                    }}
                    className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-[#123E32]"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#123E32] flex items-center justify-center text-emerald-300 hover:text-white"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto no-scrollbar space-y-2.5 flex-1 pr-1">
              {currentRoleNotifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-full bg-[#123E32] flex items-center justify-center mx-auto mb-3 border border-[#16834A]/30">
                    <CheckCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="font-display font-bold text-base text-white mb-1">All Caught Up!</h4>
                  <p className="text-xs text-emerald-200/70 max-w-xs mx-auto">
                    You have no new alerts. Real-time updates on demand surges, matching discounts, and orders will appear here.
                  </p>
                </div>
              ) : (
                currentRoleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id, notif.type)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer touch-press flex items-start gap-3 ${
                      !notif.read
                        ? 'bg-[#123E32] border-[#C8FF55]/60 shadow-md'
                        : 'bg-[#081E17]/70 border-[#16834A]/30 opacity-75'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0D3328] flex items-center justify-center border border-[#16834A]/50 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-display font-bold text-xs text-white truncate">{notif.title}</h4>
                        <span className="text-[10px] text-emerald-300/60 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-emerald-100/80 leading-relaxed mb-2">{notif.message}</p>
                      <div className="flex items-center text-[10px] text-[#C8FF55] font-semibold gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
