import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';
import {
  ListChecks,
  Tag,
  TrendingUp,
  ArrowRight,
  Check,
  User,
  Store,
  Truck,
  Megaphone,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { setRole } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const slides = [
    {
      title: 'Plan Your Groceries & Master Your Budget',
      subtitle:
        'Build dynamic shopping lists with live budget meters, unit converters, and smart alternatives to eliminate grocery overspending.',
      badge: 'Eagle Vision Spending',
      icon: ListChecks,
      gradient: 'from-[#0D3328] via-[#123E32] to-[#081E17]',
      accent: '#C8FF55',
    },
    {
      title: 'Personalized Offers & Real-Time Price Radar',
      subtitle:
        'Local grocery shops and brands match discounts directly to items on your list. Compare stores instantly and claim deals before they expire.',
      badge: 'Demand-Matched Savings',
      icon: Tag,
      gradient: 'from-[#123E32] via-[#0D3328] to-[#1E3A2F]',
      accent: '#FF8A3D',
    },
    {
      title: 'Help Local Businesses Grow Together',
      subtitle:
        'Aggregated, privacy-safe list signals empower neighborhood shops to stock what you want, unlock wholesale discounts, and thrive.',
      badge: 'Community Ecosystem',
      icon: TrendingUp,
      gradient: 'from-[#081E17] via-[#0D3328] to-[#123E32]',
      accent: '#C8FF55',
    },
  ];

  const roles: {
    id: UserRole;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[] = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shop smart, track budgets, and save on groceries',
      icon: User,
      accent: 'border-[#C8FF55] text-[#C8FF55]',
    },
    {
      id: 'shop_owner',
      title: 'Shop Owner',
      subtitle: 'Analyze neighbourhood demand & launch flash offers',
      icon: Store,
      accent: 'border-[#FF8A3D] text-[#FF8A3D]',
    },
    {
      id: 'wholesale',
      title: 'Wholesale Dealer',
      subtitle: 'Supply local stores with bulk goods at tiered rates',
      icon: Truck,
      accent: 'border-emerald-400 text-emerald-400',
    },
    {
      id: 'offer_provider',
      title: 'Offer Provider',
      subtitle: 'Promote FMCG brands & track campaign conversions',
      icon: Megaphone,
      accent: 'border-amber-300 text-amber-300',
    },
  ];

  const handleNext = () => {
    sound.playPop();
    if (currentStep < slides.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setRole(selectedRole);
      onComplete();
    }
  };

  const isRoleSelectionStep = currentStep === slides.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#081713] text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Top Header with step indicators & skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((stepIdx) => (
            <motion.div
              key={stepIdx}
              className={`h-1.5 rounded-full transition-all ${
                currentStep === stepIdx
                  ? 'w-7 bg-[#C8FF55]'
                  : currentStep > stepIdx
                  ? 'w-3 bg-emerald-600'
                  : 'w-3 bg-[#123E32]'
              }`}
            />
          ))}
        </div>

        {!isRoleSelectionStep && (
          <button
            onClick={() => {
              sound.playPop();
              setCurrentStep(slides.length);
            }}
            className="text-xs text-emerald-300/80 hover:text-white px-2.5 py-1 rounded-md"
          >
            Skip
          </button>
        )}
      </div>

      {/* Slide Content or Role Selection */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          {!isRoleSelectionStep ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center max-w-sm mx-auto"
            >
              {/* Visual Card / Illustration Container */}
              <div
                className={`w-36 h-36 rounded-3xl bg-gradient-to-br ${slides[currentStep].gradient} border border-[#16834A]/50 flex items-center justify-center mb-8 shadow-2xl relative`}
              >
                {React.createElement(slides[currentStep].icon, {
                  className: 'w-16 h-16',
                  style: { color: slides[currentStep].accent },
                })}
                <span
                  className="absolute -top-3 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#081E17] border"
                  style={{
                    borderColor: slides[currentStep].accent,
                    color: slides[currentStep].accent,
                  }}
                >
                  {slides[currentStep].badge}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-white mb-3 leading-snug">
                {slides[currentStep].title}
              </h2>

              <p className="text-sm text-emerald-200/80 leading-relaxed max-w-xs">
                {slides[currentStep].subtitle}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="role-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="text-center mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8FF55] bg-[#123E32] px-3 py-1 rounded-full border border-[#16834A]/40 inline-block mb-2">
                  Unified Ecosystem
                </span>
                <h2 className="font-display font-extrabold text-2xl text-white">Choose Your Role</h2>
                <p className="text-xs text-emerald-200/70">
                  Select your primary perspective. You can freely switch anytime.
                </p>
              </div>

              <div className="space-y-2.5">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  const Icon = r.icon;

                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedRole(r.id);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all touch-press flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#123E32] border-[#C8FF55] shadow-lg shadow-[#16834A]/20'
                          : 'bg-[#081E17]/80 border-[#16834A]/30 hover:border-[#16834A]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-[#0D3328] flex items-center justify-center border ${r.accent} shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-white">{r.title}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#C8FF55] flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#0D3328] stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-200/70 truncate">{r.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-sm mx-auto pb-4">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-gradient-to-r from-[#C8FF55] to-[#a4f21e] text-[#0D3328] font-display font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C8FF55]/20 flex items-center justify-center gap-2 hover:brightness-105 transition-all touch-press"
        >
          <span>{isRoleSelectionStep ? 'Enter AquilCart' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
