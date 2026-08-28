import React from 'react';
import { Scene3D } from './3d/Scene3D';
import { ProductConfig, HotspotAnnotation } from '../types';
import { MATERIAL_PRESETS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { Sparkles, ShieldCheck, Zap, ArrowDown, ChevronLeft, Sun, WifiOff, Camera, CheckCircle2, Truck, RotateCcw, Flame } from 'lucide-react';

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
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-600/15 via-amber-500/10 to-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Right Column (in RTL): Headlines, Value Proposition & CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 z-10 text-right">
          
          {/* Offer Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-cyan-500/30 text-xs text-neutral-300 w-fit backdrop-blur-md shadow-lg shadow-cyan-950/40 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-amber-400">السعر: 3 ملايين و 600 ألف د.ج (36,000 د.ج)</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-300 font-bold">توصيل مجاني لـ 58 ولاية (تسيي قبل ما تخلص)</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-100 leading-[1.25]">
              كاميرا المراقبة الذكية <br />
              <span className="bg-gradient-to-l from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
                بالطاقة الشمسية وشريحة 4G المزدوجة
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              حماية متواصلة 24/7 للمنازل، المزارع، الاستراحات، ومواقع العمل مع <strong className="text-amber-400">نظام كشف النيران والحرائق</strong> والردع الفوري بدون أسلاك كهرباء وبدون واي فاي منزلي. عدسة ثابتة للمدخل + عدسة متحركة 360° تتبع الحركة وتكشف المتسللين فوراً عبر تطبيق <strong className="text-cyan-400">V380 Pro</strong>.
            </p>
          </div>

          {/* Key Benefit Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-200">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span>طاقة شمسية 365</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-200">
              <WifiOff className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>شريحة 4G بدون نت</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-200">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>كشف النيران والحرائق</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-200">
              <Camera className="w-4 h-4 text-purple-400 shrink-0" />
              <span>عدستان في جهاز واحد</span>
            </div>
          </div>

          {/* Color Finish Display */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">لون هيكل الكاميرا المعتمد:</span>
              <span className="text-cyan-400 font-bold">{config.material.name}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
              <div
                className="w-5 h-5 rounded-full border-2 border-cyan-400 shadow-md shrink-0"
                style={{ backgroundColor: config.material.bodyColor }}
              />
              <span>هيكل معزز بطلاء التيتانيوم المقاوم للشمس والأمطار والغبار (IP66)</span>
            </div>
          </div>

          {/* Action Button CTA Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenReservation();
              }}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-neutral-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>اطلب الآن مع توصيل مجاني 58 ولاية</span>
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="px-5 py-3.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 font-bold text-xs border border-cyan-500/50 shadow-lg shadow-cyan-950/50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>العرض في غرفتك (AR)</span>
            </button>

            {onOpenTour && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenTour();
                }}
                className="px-4 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2 hover:border-cyan-400"
                title="جولة تعليمية تفاعلية سريعة"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>دليل الاستخدام</span>
              </button>
            )}

            <button
              onClick={() => scrollTo('inspector')}
              className="px-4 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all duration-200 flex items-center justify-center gap-2 hover:border-cyan-500/40"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" />
              <span>المكونات 3D</span>
            </button>
          </div>

          {/* Guarantees & Trust Signals */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ضمان ذهبي سنتين مع استبدال فوري</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>توصيل مجاني لكافة المناطق</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>معاينة وتشغيل قبل الدفع</span>
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
          onClick={() => scrollTo('features')}
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span>اكتشف تفاصيل التقنيات والمواصفات الكاملة</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
