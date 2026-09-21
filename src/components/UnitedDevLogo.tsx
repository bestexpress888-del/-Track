import React, { useState } from 'react';
import logoImg from '../assets/images/united_dev_logo_1789975287370.jpg';

interface UnitedDevLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'badge';
}

export const UnitedDevLogo: React.FC<UnitedDevLogoProps> = ({ 
  className = 'w-10 h-10', 
  showText = false,
  variant = 'icon'
}) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError && logoImg) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}>
        <img
          src={logoImg}
          alt="United Development Co., Ltd."
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // High-fidelity SVG Fallback matching the exact emblem
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full object-contain"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Golden Sun Gradient */}
          <radialGradient id="sunGoldGradDirect" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="30%" stopColor="#F7CE46" />
            <stop offset="70%" stopColor="#E5A624" />
            <stop offset="100%" stopColor="#B3770D" />
          </radialGradient>

          {/* Leaf Gradients */}
          <linearGradient id="leaf1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B4228" />
            <stop offset="100%" stopColor="#0D2415" />
          </linearGradient>

          <linearGradient id="leaf2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6B3E" />
            <stop offset="100%" stopColor="#164324" />
          </linearGradient>

          <linearGradient id="leaf3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3F8E52" />
            <stop offset="100%" stopColor="#1E5C31" />
          </linearGradient>

          <linearGradient id="leaf4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E6C41" />
            <stop offset="100%" stopColor="#1A4526" />
          </linearGradient>

          <linearGradient id="leaf5Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FA05B" />
            <stop offset="100%" stopColor="#256B34" />
          </linearGradient>

          <linearGradient id="leaf6Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78C236" />
            <stop offset="100%" stopColor="#428E18" />
          </linearGradient>

          {/* Text Arc along circular path */}
          <path id="unitedDevTextArcFallback" d="M 75 220 A 185 185 0 0 1 425 220" fill="none" />
        </defs>

        {/* Text Curving Along Top */}
        <text 
          fontFamily="'Arial', 'Segoe UI', 'Prompt', sans-serif" 
          fontWeight="800" 
          fontSize="19" 
          letterSpacing="3" 
          fill="#1E5C31"
        >
          <textPath href="#unitedDevTextArcFallback" startOffset="50%" textAnchor="middle">
            UNITED DEVELOPMENT CO.,LTD.
          </textPath>
        </text>

        {/* Circular Emblem Body */}
        <g transform="translate(250, 245)">
          {/* Golden Sun Dome */}
          <path 
            d="M -100 -92 A 136 136 0 0 1 100 -92 C 70 -35, 18 -10, -22 5 C -65 -15, -82 -55, -100 -92 Z"
            fill="url(#sunGoldGradDirect)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 1: Far Left (Dark Forest Green) */}
          <path 
            d="M -14 118 C -45 105, -95 78, -126 30 C -138 4, -132 -30, -108 -48 C -86 -26, -44 35, -14 118 Z"
            fill="url(#leaf1Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 2: Mid Left (Rich Green) */}
          <path 
            d="M -10 118 C -22 52, -48 -18, -82 -74 C -56 -82, -8 -35, 9 44 C 4 78, -3 105, -10 118 Z"
            fill="url(#leaf2Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 3: Center Upright Leaf */}
          <path 
            d="M -5 119 C 2 61, 13 -9, 16 -83 C 33 -65, 36 17, 24 74 C 15 100, 5 114, -5 119 Z"
            fill="url(#leaf3Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 4: Upper Right Leaf */}
          <path 
            d="M 0 119 C 24 70, 65 9, 111 -35 C 117 13, 83 70, 31 109 C 18 115, 7 118, 0 119 Z"
            fill="url(#leaf4Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 5: Mid Right Leaf */}
          <path 
            d="M 5 119 C 44 92, 100 57, 135 9 C 137 40, 104 83, 48 114 C 30 118, 16 119, 5 119 Z"
            fill="url(#leaf5Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Leaf 6: Lower Right Leaf (Bright Lime Green) */}
          <path 
            d="M 10 119 C 48 109, 96 87, 120 57 C 124 74, 100 105, 50 120 C 33 120, 19 120, 10 119 Z"
            fill="url(#leaf6Grad)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          <circle cx="-2" cy="120" r="5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
