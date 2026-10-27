import React from 'react';

interface ZimbabweLiveFlagProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPulseBadge?: boolean;
  showCountryLabel?: boolean;
  className?: string;
}

/**
 * Authentic Zimbabwe Live Flag Component
 * Featuring the 7 national stripes (Green, Yellow, Red, Black, Red, Yellow, Green),
 * the white hoist triangle, red 5-pointed star, and the Great Zimbabwe Bird (Hungwe)
 * with a continuous realistic fabric ripple/flutter animation.
 */
export const ZimbabweLiveFlag: React.FC<ZimbabweLiveFlagProps> = ({
  size = 'md',
  showPulseBadge = true,
  showCountryLabel = false,
  className = ''
}) => {
  // Dimensions based on size
  const sizeMap = {
    sm: { width: 44, height: 26, starSize: 6 },
    md: { width: 68, height: 40, starSize: 9 },
    lg: { width: 96, height: 56, starSize: 13 },
    xl: { width: 136, height: 80, starSize: 18 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Animated Flag Canvas with Continuous Ripple & Fabric Sheen */}
      <div 
        className="relative rounded-md overflow-hidden shadow-md border border-slate-700/60 shrink-0 select-none group"
        style={{ width: `${width}px`, height: `${height}px` }}
        title="National Flag of the Republic of Zimbabwe • Live Agro-Ecological Network"
      >
        {/* SVG Flag Rendering */}
        <svg
          viewBox="0 0 120 70"
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fabric ripple gradient simulation */}
            <linearGradient id="flagRipple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>

            {/* Subtle gloss highlight */}
            <linearGradient id="flagGloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 7 Official Horizontal Stripes (Ratio 10:10:10:10:10:10:10) */}
          {/* 1. Green (Agriculture & Rural Land) */}
          <rect x="0" y="0" width="120" height="10" fill="#006400" />
          {/* 2. Yellow / Gold (Mineral Wealth) */}
          <rect x="0" y="10" width="120" height="10" fill="#FFD100" />
          {/* 3. Red (Blood shed for liberation) */}
          <rect x="0" y="20" width="120" height="10" fill="#D40000" />
          {/* 4. Black (Majority Population) */}
          <rect x="0" y="30" width="120" height="10" fill="#000000" />
          {/* 5. Red (Blood shed for liberation) */}
          <rect x="0" y="40" width="120" height="10" fill="#D40000" />
          {/* 6. Yellow / Gold (Mineral Wealth) */}
          <rect x="0" y="50" width="120" height="10" fill="#FFD100" />
          {/* 7. Green (Agriculture & Rural Land) */}
          <rect x="0" y="60" width="120" height="10" fill="#006400" />

          {/* White Triangle at Hoist (Peace) with Thin Black Border */}
          <polygon points="0,0 45,35 0,70" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />

          {/* Red 5-Pointed Star (Peace & Aspiration) centered around (19, 35) */}
          <polygon
            points="
              19,23
              21.7,30.5
              29.8,30.5
              23.2,35.2
              25.7,42.8
              19,38.2
              12.3,42.8
              14.8,35.2
              8.2,30.5
              16.3,30.5
            "
            fill="#D40000"
          />

          {/* Great Zimbabwe Bird (Hungwe) in Gold/Yellow overlaid on the Star */}
          <g transform="translate(14, 27) scale(0.65)" fill="#FFD100">
            {/* Bird Head & Beak */}
            <path d="M 6.5 2 C 7.5 1 8.8 1 9.5 2 C 10 2.5 11.5 2.5 12 3 C 10.5 4 9.5 4.5 9 5.5 C 8.5 6.5 8 7 8 8 L 5 8 C 5 6 5.5 4 6.5 2 Z" />
            {/* Bird Body & Plinth */}
            <path d="M 5 8 C 6 8.5 7 10 7 12 C 7 14 6 15 5 17 L 3 17 C 2 15 2 13 3 11 C 3.5 10 4 9 5 8 Z" />
            {/* Bird Wing & Tail Feathers */}
            <path d="M 7 11 C 9 11 11 13 12 16 L 9 17 C 8 15 7.5 13 7 11 Z" />
            {/* Plinth Base (The Ancient Soapstone Pedestal) */}
            <rect x="2" y="17" width="9" height="2.5" rx="0.5" />
          </g>

          {/* Semi-transparent Ripple Shading for Live 3D Waving Effect */}
          <rect x="0" y="0" width="120" height="70" fill="url(#flagRipple)" className="mix-blend-overlay pointer-events-none" />
          <rect x="0" y="0" width="120" height="70" fill="url(#flagGloss)" className="mix-blend-screen pointer-events-none" />
        </svg>

        {/* Live Wind Shimmer Wave Layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 45%, rgba(0,0,0,0.25) 55%, transparent 80%)',
            backgroundSize: '200% 100%',
            animation: 'zimFlagWave 3.2s ease-in-out infinite'
          }}
        />

        {/* Subtle Wind Wave Distortion styling via inline CSS keyframe */}
        <style>{`
          @keyframes zimFlagWave {
            0% {
              background-position: -200% 0;
              opacity: 0.8;
            }
            50% {
              opacity: 1;
            }
            100% {
              background-position: 200% 0;
              opacity: 0.8;
            }
          }
        `}</style>
      </div>

      {/* Optional Live Pulse and Country Tag */}
      {(showPulseBadge || showCountryLabel) && (
        <div className="flex flex-col justify-center leading-none">
          {showPulseBadge && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase font-mono">
                ZW LIVE
              </span>
            </div>
          )}

          {showCountryLabel && (
            <span className="text-[11px] font-extrabold text-slate-200 mt-0.5 tracking-tight">
              Zimbabwe Agro-Network
            </span>
          )}
        </div>
      )}
    </div>
  );
};
