import React from 'react';

interface DimossLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon' | 'white' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withContainer?: boolean;
}

export const DimossLogo: React.FC<DimossLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  withContainer = false,
}) => {
  // Height and scale profiles
  const sizeClasses = {
    sm: variant === 'icon' ? 'w-7 h-7' : 'h-7 sm:h-8',
    md: variant === 'icon' ? 'w-10 h-10' : 'h-9 sm:h-11',
    lg: variant === 'icon' ? 'w-14 h-14' : 'h-12 sm:h-14',
    xl: variant === 'icon' ? 'w-20 h-20' : 'h-16 sm:h-20',
  };

  const primaryRed = '#E30613';
  const isWhite = variant === 'white';
  const fillColor = isWhite ? '#ffffff' : primaryRed;

  // Standalone Icon SVG
  const LogoIcon = (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${variant === 'icon' ? sizeClasses[size] : 'h-full w-auto'} shrink-0 drop-shadow-sm`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 78C7.5 78 4 74.5 4 70C4 44 24 16 62 16C94 16 116 38 116 60C116 82 94 96 62 96L24 96C17.5 96 12 90.5 12 84L12 78ZM62 36C46 36 34 47 34 60C34 65.5 38.5 70 44 70L62 70C73 70 82 65 82 60C82 48 73 36 62 36Z"
        fill={fillColor}
      />
      {/* Internal Ribbon Flow Path representing the exact Dimoss D-loop */}
      <path
        d="M12 76C12 76 12 50 36 32C46 24 56 22 64 22C88 22 108 40 108 60C108 78 90 90 64 90L22 90C16.5 90 12 85.5 12 80V76Z"
        fill={fillColor}
      />
      {/* Center cutout creating the ribbon knot */}
      <path
        d="M62 40C50 40 40 49 40 60C40 65 44 68 50 68L64 68C72 68 78 64 78 60C78 50 72 40 62 40Z"
        fill={withContainer && !isWhite ? '#ffffff' : '#0c0a09'}
      />
      <path
        d="M12 60L46 60C50 60 54 56 54 52C54 48 50 44 46 44L22 44"
        fill={fillColor}
      />
    </svg>
  );

  // Full Vector Logo with Arabic Typography, English "dimös", and Slogan
  const FullLogoSVG = (
    <svg
      viewBox="0 0 360 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto max-w-full drop-shadow-sm select-none`}
    >
      {/* 1. Iconic Left D-Loop Ribbon */}
      <g transform="translate(2, 6)">
        {/* Main curved D-loop */}
        <path
          d="M 16 68 C 16 38 36 14 74 14 C 110 14 134 36 134 60 C 134 84 110 102 74 102 L 28 102 C 21 102 16 97 16 90 L 16 68 Z"
          fill={fillColor}
        />
        {/* Cutout / inner opening */}
        <path
          d="M 72 38 C 54 38 42 48 42 60 C 42 66 46 72 54 72 L 74 72 C 86 72 96 66 96 60 C 96 48 86 38 72 38 Z"
          fill={withContainer && !isWhite ? '#ffffff' : '#0c0a09'}
        />
        {/* Inner lower loop horizontal branch */}
        <path
          d="M 16 68 L 56 68 C 62 68 68 64 68 58 C 68 52 62 48 56 48 L 30 48 C 22 48 16 54 16 62 Z"
          fill={fillColor}
        />
      </g>

      {/* 2. Top Arabic Typography: ديموس */}
      <g transform="translate(152, 6)" fill={fillColor}>
        {/* د */}
        <path d="M 194 36 C 194 20 185 14 175 14 C 165 14 158 20 158 28 L 158 36 L 168 36 L 168 28 C 168 23 172 21 175 21 C 179 21 183 24 183 30 L 183 36 Z" />
        
        {/* ي */}
        <path d="M 154 36 L 154 22 L 144 22 L 144 36 Z" />
        <circle cx="149" cy="42" r="3.2" />
        <circle cx="139" cy="42" r="3.2" />

        {/* م */}
        <path d="M 136 36 L 136 26 C 136 18 126 14 116 14 C 106 14 98 19 98 27 C 98 35 106 36 114 36 L 136 36 Z M 116 21 C 122 21 126 23 126 27 C 126 31 122 31 116 31 C 110 31 107 29 107 27 C 107 23 110 21 116 21 Z" />

        {/* و */}
        <path d="M 94 36 L 94 24 C 94 16 85 14 77 14 C 68 14 62 19 62 27 C 62 36 70 38 78 38 L 84 38 L 74 54 L 84 54 L 94 36 Z M 77 21 C 82 21 85 23 85 27 C 85 30 82 31 77 31 C 72 31 70 29 70 27 C 70 23 72 21 77 21 Z" />

        {/* س */}
        <path d="M 58 36 L 58 20 L 50 20 L 50 30 L 42 20 L 34 20 L 34 30 L 26 20 L 16 20 L 16 34 C 16 46 26 52 38 52 C 48 52 56 46 58 36 Z M 26 34 L 26 28 L 30 34 L 38 34 L 42 28 L 46 34 L 54 34 C 52 42 46 45 38 45 C 30 45 26 40 26 34 Z" />

        {/* Unified Calligraphy Render Text for pristine fallback */}
        <text
          x="195"
          y="38"
          textAnchor="end"
          fontSize="36"
          fontWeight="900"
          fontFamily="'Cairo', 'Segoe UI', Arial, sans-serif"
          fill={fillColor}
          letterSpacing="1px"
        >
          ديموس
        </text>
      </g>

      {/* 3. Middle English Typography: dimös */}
      <g transform="translate(152, 48)" fill={fillColor}>
        {/* d */}
        <path d="M 22 34 L 22 24 C 20 25 17 26 14 26 C 6 26 0 20 0 13 C 0 6 6 0 14 0 C 18 0 21 2 23 4 L 23 0 L 31 0 L 31 34 L 22 34 Z M 15 8 C 10 8 7 10 7 13 C 7 16 10 18 15 18 C 20 18 23 15 23 13 C 23 10 20 8 15 8 Z" />
        
        {/* i */}
        <rect x="36" y="8" width="8" height="26" rx="2" />
        <circle cx="40" cy="2" r="4" />

        {/* m */}
        <path d="M 49 8 L 57 8 L 57 12 C 59 9 63 8 68 8 C 73 8 77 10 79 14 C 82 9 87 8 92 8 C 99 8 103 12 103 20 L 103 34 L 95 34 L 95 21 C 95 16 93 14 89 14 C 85 14 83 16 83 21 L 83 34 L 75 34 L 75 21 C 75 16 73 14 69 14 C 65 14 63 16 63 21 L 63 34 L 55 34 L 55 8 L 49 8 Z" />

        {/* ö with two dots */}
        <path d="M 121 8 C 111 8 105 14 105 21 C 105 28 111 34 121 34 C 131 34 137 28 137 21 C 137 14 131 8 121 8 Z M 121 14 C 126 14 129 17 129 21 C 129 25 126 28 121 28 C 116 28 113 25 113 21 C 113 17 116 14 121 14 Z" />
        <circle cx="117" cy="2" r="3" />
        <circle cx="125" cy="2" r="3" />

        {/* s */}
        <path d="M 143 27 C 144 31 148 34 154 34 C 160 34 164 31 164 27 C 164 22 159 20 152 19 C 143 17 139 14 139 9 C 139 3 145 0 153 0 C 161 0 166 4 167 9 L 159 9 C 158 6 156 5 153 5 C 149 5 147 6 147 8 C 147 11 150 12 157 14 C 165 16 172 19 172 25 C 172 32 165 36 154 36 C 144 36 137 31 136 25 L 143 27 Z" />

        {/* Text representation */}
        <text
          x="0"
          y="35"
          fontSize="36"
          fontWeight="900"
          fontFamily="'Comfortaa', 'Montserrat', 'Segoe UI', sans-serif"
          fill={fillColor}
          letterSpacing="-0.5px"
        >
          dimös
        </text>
      </g>

      {/* 4. Bottom Slogan: A Style Statement Of Your Home */}
      <g transform="translate(152, 98)" fill={fillColor}>
        <text
          x="0"
          y="10"
          fontSize="11.5"
          fontWeight="800"
          fontFamily="'Cairo', 'Segoe UI', Tahoma, sans-serif"
          fill={fillColor}
          letterSpacing="0.8px"
        >
          A Style Statement Of Your Home
        </text>
      </g>
    </svg>
  );

  // Compact variant (Emblem + ديموس dimös)
  const CompactLogo = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        {LogoIcon}
      </div>
      <div className="flex flex-col text-right leading-none">
        <span className="font-black text-base sm:text-lg text-white font-sans tracking-tight">
          ديموس <span className="text-[#E30613] font-bold">dimös</span>
        </span>
        <span className="text-[9px] text-neutral-400 font-medium tracking-wider">
          A Style Statement Of Your Home
        </span>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return LogoIcon;
  }

  if (variant === 'compact') {
    return CompactLogo;
  }

  if (withContainer) {
    return (
      <div
        className={`inline-flex items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl shadow-red-950/20 border border-neutral-200/80 transition-transform hover:scale-[1.02] ${className}`}
      >
        {FullLogoSVG}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      {FullLogoSVG}
    </div>
  );
};
