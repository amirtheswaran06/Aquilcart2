import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EagleEmblem, EagleWingsRevealer } from '../brand/EagleLogo';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/sound';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    sound.playSuccess();
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#081713] flex flex-col items-center justify-between p-6 text-white overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-[#16834A]/25 to-[#C8FF55]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative top wing ambient sweep */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1.1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute top-10 w-full max-w-sm pointer-events-none"
      >
        <EagleWingsRevealer className="w-full opacity-60" />
      </motion.div>

      <div className="w-full flex justify-end pt-4">
        {canSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onComplete}
            className="text-xs text-emerald-300/80 hover:text-white px-3 py-1.5 rounded-full bg-[#123E32]/70 border border-[#16834A]/30 backdrop-blur-md"
          >
            Skip Intro
          </motion.button>
        )}
      </div>

      {/* Center Eagle Logo & Brand Presentation */}
      <div className="flex flex-col items-center text-center my-auto relative z-10">
        <motion.div
          initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.15,
          }}
          className="relative mb-6"
        >
          {/* Animated glow ring */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(200, 255, 85, 0.2)',
                '0 0 50px rgba(22, 131, 74, 0.5)',
                '0 0 20px rgba(200, 255, 85, 0.2)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0D3328] to-[#081E17] border-2 border-[#C8FF55]/40 flex items-center justify-center p-3"
          >
            <EagleEmblem size={84} />
          </motion.div>

          {/* Vision Sparkle Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-2 -right-2 bg-[#FF8A3D] text-[#0D3328] p-1.5 rounded-full shadow-lg"
          >
            <Sparkles className="w-4 h-4 fill-white text-white" />
          </motion.div>
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white mb-2"
        >
          AQUIL<span className="text-[#C8FF55]">CART</span>
        </motion.h1>

        {/* Brand Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-emerald-300 font-medium text-sm tracking-wide max-w-xs"
        >
          Shop Smart. Save More. Grow Together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 flex items-center gap-1.5 text-[11px] text-[#A1B3A8]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF55]" />
          <span>Demand-Driven Grocery Intelligence</span>
        </motion.div>
      </div>

      {/* Bottom Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-xs pb-6"
      >
        <button
          onClick={() => {
            sound.playSuccess();
            onComplete();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-[#C8FF55] to-[#99ea19] text-[#0D3328] font-display font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C8FF55]/20 flex items-center justify-center gap-2 hover:brightness-105 transition-all touch-press"
        >
          <span>Take Flight</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
