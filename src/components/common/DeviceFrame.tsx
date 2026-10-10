import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';
import {
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface DeviceFrameProps {
  children: React.ReactNode;
  onOpenRoleSwitcher: () => void;
  onRestartIntro: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  onOpenRoleSwitcher,
  onRestartIntro,
}) => {
  const { state, setRole, resetToDemoState } = useAppStore();
  const [isFrameMode, setIsFrameMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
    if (sound.enabled) sound.playPop();
  };

  const roles: { id: UserRole; label: string }[] = [
    { id: 'customer', label: 'Customer' },
    { id: 'shop_owner', label: 'Shop Owner' },
    { id: 'wholesale', label: 'Wholesaler' },
    { id: 'offer_provider', label: 'Provider' },
  ];

  return (
    <div className="min-h-screen bg-[#06120E] flex flex-col items-center justify-start p-0 md:p-6 overflow-x-hidden selection:bg-[#C8FF55] selection:text-[#0D3328]">
      {/* Outer Reviewer / Developer Top Toolbelt (visible on tablet & desktop) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 py-2.5 bg-[#0D3328]/80 backdrop-blur-md rounded-2xl border border-[#16834A]/40 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF55] animate-pulse" />
            <span className="font-display font-extrabold text-sm tracking-tight text-white">
              AQUIL<span className="text-[#C8FF55]">CART</span>
            </span>
          </div>
          <span className="text-xs text-emerald-300/60 hidden lg:inline">
            · Mobile Grocery Ecosystem Simulator
          </span>
        </div>

        {/* Center Quick Role Pills */}
        <div className="flex items-center gap-1 bg-[#081E17] p-1 rounded-xl border border-[#16834A]/30">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                sound.playPop();
                setRole(r.id);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all touch-press ${
                state.currentRole === r.id
                  ? 'bg-[#C8FF55] text-[#0D3328] shadow font-bold'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Right utility toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="p-1.5 rounded-lg bg-[#123E32] text-emerald-200 hover:text-white border border-[#16834A]/40"
            title={isFrameMode ? 'Switch to Full Screen View' : 'Switch to Smartphone Bezel Frame'}
          >
            {isFrameMode ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-[#123E32] text-emerald-200 hover:text-white border border-[#16834A]/40"
            title={isMuted ? 'Unmute Tactile Sound' : 'Mute Tactile Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#C8FF55]" />}
          </button>

          <button
            onClick={onRestartIntro}
            className="px-2.5 py-1 rounded-lg bg-[#123E32] text-emerald-200 hover:text-white text-xs font-medium border border-[#16834A]/40"
            title="Replay Splash & Onboarding"
          >
            Replay Intro
          </button>

          <button
            onClick={() => {
              resetToDemoState();
              sound.playSuccess();
            }}
            className="p-1.5 rounded-lg bg-[#123E32] text-emerald-200 hover:text-white border border-[#16834A]/40"
            title="Reset All Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Smartphone Frame on Desktop OR Full Viewport on Mobile */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isFrameMode
            ? 'md:max-w-[412px] md:h-[844px] md:rounded-[48px] md:border-[10px] md:border-[#1E2E28] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(22,131,74,0.25)] md:overflow-hidden md:ring-1 md:ring-white/10'
            : 'max-w-md h-screen'
        } bg-[#081713] flex flex-col`}
      >
        {/* Native Mobile Status Bar & Dynamic Island */}
        <div className="sticky top-0 z-40 bg-[#0D3328] text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-xs select-none border-b border-[#16834A]/20">
          <span className="font-semibold text-[11px] tracking-tight">{currentTime}</span>

          {/* Dynamic Island pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D3328] border border-emerald-500/30 ring-1 ring-black" />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </main>

        {/* Bottom iOS Home Indicator */}
        <div className="hidden md:flex justify-center pb-2 bg-[#0D3328] shrink-0">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
