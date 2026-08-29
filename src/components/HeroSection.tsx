import React from 'react';
import { Scene3D } from './3d/Scene3D';
import { ProductConfig, HotspotAnnotation } from '../types';
import { MATERIAL_PRESETS, PRODUCT_INFO } from '../data/productData';
import { soundFx } from '../utils/audio';
import { DimossLogo } from './DimossLogo';
import {
  Sparkles,
  ShieldCheck,
  ArrowDown,
  ChevronLeft,
  Camera,
  CheckCircle2,
  Truck,
  RotateCcw,
  Palette,
  Award,
  CreditCard,
  Crown,
  Layers,
} from 'lucide-react';

interface HeroSectionProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onSelectHotspot: (hotspot: HotspotAnnotation | null) => void;
  onOpenReservation: () => void;
  onOpenAR: () => void;
  onOpenTour?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onConfigChange,
  onSelectHotspot,
  onOpenReservation,
  onOpenAR,
  onOpenTour,
}) => {
  const scrollTo = (id: string) => {
    soundFx.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-12 flex flex-col justify-between overflow-hidden">
      {/* Ambient Luxury Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-600/15 via-yellow-500/10 to-amber-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Right Column (in RTL): Headlines, Value Proposition & CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 z-10 text-right">
          
          {/* Saudi Offer Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/40 text-xs text-neutral-300 w-fit backdrop-blur-md shadow-xl shadow-amber-950/40 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-black text-amber-400">تقسيط 4 دفعات بدون فوائد عبر تابي أو تمارا (1,237 ر.س/شهر)</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-300 font-bold">توصيل وتركيب VIP مجاني لكافة مدن المملكة 🇸🇦</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="p-1.5 rounded-xl bg-white/95 border border-neutral-200/50 shadow-md inline-flex items-center">
                <DimossLogo variant="full" size="sm" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-[11px] font-black text-red-300">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>الشعار الرسمي المعتمد • DIMOSS KSA</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-100 leading-[1.25]">
              فخامة المجالس والكنب الإيطالي <br />
              <span className="bg-gradient-to-l from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                صُممت لتدوم مدى الحياة
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              استمتع بأعلى معايير الراحة والحرفية الأوروبية لمجلسك وصالتك في السعودية. هيكل من خشب الزان المصمت، اسفنج ميموري فوم <strong className="text-amber-400">HR 45D</strong>، وأقمشة نانو مقاومة للبقع والسوائل مع <strong className="text-amber-300">ضمان ذهبي 10 سنوات</strong> وتوصيل وتركيب شامل.
            </p>
          </div>

          {/* Key Benefit Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>خشب زان أوروبي</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ضمان 10 سنوات</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>أقمشة نانو ضد البقع</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
              <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>تابي & تمارا 0%</span>
            </div>
          </div>

          {/* Color & Material Active Info */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-bold text-neutral-300">الخامة واللون المختار حالياً:</span>
              <span className="text-amber-400 font-extrabold">{config.material.name}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
              <div
                className="w-5 h-5 rounded-full border-2 border-amber-400 shadow-md shrink-0"
                style={{ backgroundColor: config.material.bodyColor }}
              />
              <span className="truncate">{config.material.finish}</span>
            </div>
          </div>

          {/* Action Button CTA Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenReservation();
              }}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>اطلب الآن (تقسيط ميسر أو دفع عند التركيب)</span>
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="px-5 py-3.5 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 font-bold text-xs border border-amber-500/50 shadow-lg shadow-amber-950/50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>معاينة في صالتك (AR)</span>
            </button>

            <button
              onClick={() => scrollTo('customizer')}
              className="px-4 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs border border-neutral-700 transition-all duration-200 flex items-center justify-center gap-2 hover:border-amber-500/40"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>تخصيص الأقمشة</span>
            </button>
          </div>

          {/* Guarantees & Trust Signals in Saudi Arabia */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ضمان ذهبي 10 سنوات مع استبدال فوري</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>توصيل وتركيب VIP مجاني لكافة مدن المملكة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>معاينة وتجربة قبل السداد</span>
            </div>
          </div>

        </div>

        {/* Left Column (in RTL): Live Interactive 3D WebGL Viewport */}
        <div className="lg:col-span-6 h-[460px] sm:h-[520px] lg:h-[580px] w-full rounded-3xl bg-neutral-900/40 border border-neutral-800/80 relative overflow-hidden backdrop-blur-xl shadow-2xl shadow-neutral-950/80 group">
          <Scene3D
            config={config}
            onConfigChange={onConfigChange}
            onSelectHotspot={onSelectHotspot}
            onOpenAR={onOpenAR}
            interactive={true}
          />
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-center pt-6">
        <button
          onClick={() => scrollTo('customizer')}
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-amber-400 transition-colors group cursor-pointer"
        >
          <span>استكشف تفاصيل الأقمشة وخشب الزان وتجربة 3D الكاملة</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
