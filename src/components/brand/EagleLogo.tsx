import React from 'react';

interface EagleLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  variant?: 'full' | 'icon' | 'badge';
  lightText?: boolean;
}

export const EagleEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="eagleEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8FF55" />
          <stop offset="45%" stopColor="#16834A" />
          <stop offset="100%" stopColor="#0D3328" />
        </linearGradient>
        <linearGradient id="limeWing" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#C8FF55" />
          <stop offset="100%" stopColor="#16834A" />
        </linearGradient>
        <linearGradient id="beakOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#FF8A3D" />
        </linearGradient>
        <filter id="eagleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Shield Silhouette */}
      <path
        d="M60 6L98 22V62C98 86 60 114 60 114C60 114 22 86 22 62V22L60 6Z"
        fill="#081E17"
        stroke="#16834A"
        strokeWidth="2.5"
      />

      {/* Electric Lime Accent Feather Edge */}
      <path
        d="M60 12L90 25V58C90 77 60 102 60 102C60 102 30 77 30 58V25L60 12Z"
        fill="url(#eagleEmerald)"
        opacity="0.85"
      />

      {/* Eagle Crest Facets (Left Wing / Crown) */}
      <path
        d="M60 18L44 38H60L40 56H58L42 78C48 74 54 68 60 60V18Z"
        fill="#0D3328"
      />

      {/* Eagle Crest Facets (Right Wing Sweep - Dynamic Speed Lines) */}
      <path
        d="M60 18L76 38H60L80 56H62L78 78C72 74 66 68 60 60V18Z"
        fill="url(#limeWing)"
      />

      {/* Eagle Sharp Beak - Curved & Piercing (Tangerine Orange) */}
      <path
        d="M58 50L78 60L58 72L64 60L58 50Z"
        fill="url(#beakOrange)"
        filter="url(#eagleGlow)"
      />

      {/* Eagle Eye - Sharp Vision Point */}
      <circle cx="54" cy="46" r="3.5" fill="#C8FF55" />
      <circle cx="55" cy="46" r="1.5" fill="#081E17" />
    </svg>
  );
};

export const EagleWingsRevealer: React.FC<{ progress?: number; className?: string }> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M150 70C120 40 70 30 10 50C45 68 90 72 135 78L150 70Z"
        fill="#16834A"
        opacity="0.7"
      />
      <path
        d="M150 70C180 40 230 30 290 50C255 68 210 72 165 78L150 70Z"
        fill="#C8FF55"
        opacity="0.85"
      />
      <path
        d="M150 60C128 32 85 24 35 38C65 52 105 56 142 62L150 60Z"
        fill="#0D3328"
      />
      <path
        d="M150 60C172 32 215 24 265 38C235 52 195 56 158 62L150 60Z"
        fill="#C8FF55"
      />
    </svg>
  );
};

export const EagleLogo: React.FC<EagleLogoProps> = ({
  size = 40,
  className = '',
  showWordmark = true,
  lightText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <EagleEmblem size={size} />
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-extrabold tracking-tight text-xl leading-none ${
                lightText ? 'text-white' : 'text-[#0D3328]'
              }`}
            >
              AQUIL<span className="text-[#C8FF55]">CART</span>
            </span>
          </div>
          <span className="text-[9px] font-semibold tracking-wider text-[#A1B3A8] uppercase">
            Smart Shopping Takes Flight
          </span>
        </div>
      )}
    </div>
  );
};
