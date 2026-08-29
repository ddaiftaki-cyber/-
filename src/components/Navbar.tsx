import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  PhoneCall,
  Camera,
  Scan,
  Layers,
  Palette,
  ShieldCheck,
  Award,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ProductConfig } from '../types';
import { DimossLogo } from './DimossLogo';

interface NavbarProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
  onOpenAR?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onConfigChange, onOpenReservation, onOpenAR, onOpenTour }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) soundFx.playClick();
  };

  const scrollToSection = (id: string) => {
    soundFx.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3.5 sm:px-6 py-2.5 rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-neutral-950/80">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
          <div className="p-1 sm:p-1.5 rounded-xl bg-white/95 border border-neutral-200/40 shadow-lg shadow-red-950/20 group-hover:scale-105 transition-transform">
            <DimossLogo variant="full" size="sm" />
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40">
                السعودية 🇸🇦
              </span>
              <span className="text-[10px] font-bold text-amber-300 hidden md:inline">
                ضمان 10 سنوات
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium hidden sm:inline">
              مفروشات ديموس الفاخرة • كنب ومجالس
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-neutral-300">
          <button
            onClick={() => scrollToSection('dimos-catalog-section')}
            className="px-3 py-1.5 rounded-xl text-white bg-red-600/90 hover:bg-red-500 transition-all font-bold flex items-center gap-1.5 shadow-md shadow-red-900/30"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>متجر وأقسام ديموس</span>
          </button>

          <button
            onClick={() => scrollToSection('customizer')}
            className="px-3 py-1.5 rounded-xl hover:text-amber-400 hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>تخصيص الأقمشة 3D</span>
          </button>

          <button
            onClick={() => scrollToSection('room-studio')}
            className="px-3 py-1.5 rounded-xl text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/80 transition-all font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>محاكي الصالة والمجالس</span>
          </button>

          <button
            onClick={() => scrollToSection('inspector')}
            className="px-3 py-1.5 rounded-xl hover:text-amber-400 hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>تفكيك الجودة والخشب</span>
          </button>

          {/* AR Room View in Nav */}
          {onOpenAR && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="px-3 py-1.5 rounded-xl text-amber-300 bg-neutral-900 border border-amber-500/40 hover:bg-neutral-800 transition-all font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Scan className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>معاينة بالواقع المعزز (AR)</span>
            </button>
          )}

          <button
            onClick={() => scrollToSection('benchmarks')}
            className="px-3 py-1.5 rounded-xl hover:text-amber-400 hover:bg-neutral-900 transition-colors"
          >
            لماذا ديموس؟
          </button>

          <button
            onClick={() => scrollToSection('pricing')}
            className="px-3 py-1.5 rounded-xl text-amber-400 hover:bg-amber-950/40 transition-colors font-extrabold flex items-center gap-1"
          >
            <span>عروض التقسيط (تابي/تمارا)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950 font-black">4 دفعات</span>
          </button>
        </nav>

        {/* Action Controls & Fast Order CTA */}
        <div className="flex items-center gap-2">
          
          {/* AR Room Button for Mobile */}
          {onOpenAR && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-300 text-xs font-bold"
              title="العرض في صالتك AR"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AR</span>
            </button>
          )}

          {/* Tour Guide Trigger */}
          {onOpenTour && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenTour();
              }}
              aria-label="بدء الجولة التعريفية بالمفروشات"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-1.5"
              title="دليل التصميم والمقاسات"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">جولة سريعة</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
            className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* WhatsApp Direct Concierge */}
          <a
            href="https://wa.me/966500000000?text=السلام%20عليكم%20اريد%20استشارة%20مهندس%20ديكور%20حول%20مفروشات%20ديموس"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors text-xs font-bold"
            title="استشارة مهندس ديكور مجاناً عبر واتساب"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>استشارة ديكور</span>
          </a>

          {/* Primary Purchase Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenReservation();
            }}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن (تقسيط تابي/تمارا)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
