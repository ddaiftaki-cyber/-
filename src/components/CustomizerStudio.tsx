import React, { useState } from 'react';
import { ProductConfig, MaterialConfig, LightingPreset } from '../types';
import { MATERIAL_PRESETS, CORE_GLOW_OPTIONS, LIGHTING_PRESETS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { Palette, Sun, Zap, Camera, Sparkles, Check, Sliders, Shield, Cpu, RefreshCw, ShoppingBag, BellRing, Leaf, ZapOff } from 'lucide-react';

interface CustomizerStudioProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
  onOpenAR?: () => void;
  onOpenTour?: () => void;
}

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  config,
  onConfigChange,
  onOpenReservation,
  onOpenAR,
  onOpenTour,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSelectMaterial = (mat: MaterialConfig) => {
    soundFx.playClick();
    onConfigChange({ material: mat });
  };

  const handleSelectGlow = (hex: string) => {
    soundFx.playClick();
    onConfigChange({ coreGlowColor: hex });
  };

  const handleSelectLighting = (preset: LightingPreset) => {
    soundFx.playClick();
    onConfigChange({ lightingPreset: preset });
  };

  const handleShareConfig = () => {
    soundFx.playSuccess();
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <section id="customizer" className="py-20 relative overflow-hidden text-right">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-bold text-cyan-400 tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>استوديو تخصيص الكاميرا 3D</span>
            </div>

            {onOpenTour && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenTour();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>كيف يعمل استوديو التخصيص؟</span>
              </button>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 tracking-tight">
            اختر اللون والإضاءة المناسبة لموقعك
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            شاهد تأثير الألوان المختلفة وكشافات الإضاءة الليلية وأنماط الإنذار مباشرة في نافذة العرض ثلاثية الأبعاد.
          </p>
        </div>

        {/* Studio Configurator 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Right Panel (in RTL): Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Chassis Materials & Colors */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>1. لون الهيكل الخارجي المعتمد</span>
                </div>
                <span className="text-xs text-cyan-400 font-bold">
                  {config.material.name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-cyan-500/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: config.material.bodyColor }}
                  >
                    <Check className="w-5 h-5 text-cyan-300 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-neutral-100 flex items-center gap-2">
                      <span>رمادي تيتانيوم صناعي</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                        اللون الحصري
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      طلاء تيتانيوم عالي الكثافة مقاوم للصدأ، أشعة الشمس الحارقة، والغبار الصحراوي بمعيار IP66.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-800/80 text-[11px] text-neutral-300 text-center font-mono">
                  <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">المتانة</span>
                    <span className="text-cyan-400 font-bold">IP66 عسكري</span>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">اللمعان</span>
                    <span className="text-neutral-200 font-bold">مات صناعي</span>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">مقاومة الحرارة</span>
                    <span className="text-amber-400 font-bold">-30°C إلى +65°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Floodlight & Alarm Strobe Colors */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>2. وضع الكشافات ومؤشرات الإنذار</span>
                </div>
                <span className="text-xs text-neutral-400">
                  كشافات LED ليلية وأشعة IR
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CORE_GLOW_OPTIONS.map((glow) => {
                  const isSelected = config.coreGlowColor === glow.hex;
                  return (
                    <button
                      key={glow.id}
                      onClick={() => handleSelectGlow(glow.hex)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-neutral-800 border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: glow.hex, boxShadow: `0 0 10px ${glow.hex}80` }}
                      />
                      <span className="text-xs text-neutral-200 font-medium">{glow.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Simulation Environment Lighting */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>3. محاكاة بيئة المراقبة والطقس</span>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  {LIGHTING_PRESETS.find((p) => p.id === config.lightingPreset)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LIGHTING_PRESETS.map((preset) => {
                  const isSelected = config.lightingPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectLighting(preset.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800/90 border-amber-400/80 ring-2 ring-amber-500/20'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold text-neutral-200">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="text-[11px] text-neutral-400 leading-snug">{preset.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Eco-Mode & Performance Optimization */}
            <div className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 transition-all ${
              config.ecoMode
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : 'bg-neutral-900/70 border-neutral-800/80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Leaf className={`w-4 h-4 ${config.ecoMode ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  <span>4. وضع توفير الطاقة والأداء (Eco-Mode)</span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    const next = !config.ecoMode;
                    onConfigChange({
                      ecoMode: next,
                      performanceMode: next ? 'eco' : 'balanced',
                    });
                    if (next) soundFx.playBeep();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    config.ecoMode
                      ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{config.ecoMode ? 'Eco مفعّل 🌱' : 'تفعيل Eco'}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                يقوم وضع توفير الطاقة بتقليل سطوع الإضاءة المحيطة، خفض حمل معالجة 3D GPU، وإيقاف التحديثات المستمرة لتسريع التصفح على الهواتف والأجهزة ذات الموارد المحدودة.
              </p>

              {/* Performance selector */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({ ecoMode: true, performanceMode: 'eco' });
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    config.performanceMode === 'eco'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs font-bold">توفير Eco</span>
                  <span className="text-[10px] text-neutral-400">خفيف وسريع</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({ ecoMode: false, performanceMode: 'balanced' });
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    config.performanceMode === 'balanced'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs font-bold">متوازن</span>
                  <span className="text-[10px] text-neutral-400">أداء قياسي</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({ ecoMode: false, performanceMode: 'ultra' });
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    config.performanceMode === 'ultra'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-300 ring-2 ring-purple-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs font-bold">أقصى دقة Ultra</span>
                  <span className="text-[10px] text-neutral-400">توهج 4K كامل</span>
                </button>
              </div>
            </div>

          </div>

          {/* Left Panel (in RTL): Camera Specs Summary Card & Direct Checkout */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/60">
                  ملخص مواصفات الكاميرا المختارة
                </span>
                <span className="text-xs font-mono text-neutral-400">V380-SOLAR-4G</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-neutral-100">
                  كاميرا V380 Pro المزدوجة
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  هيكل مخصص بلون <strong className="text-cyan-400">{config.material.name}</strong>، مزودة بلوح طاقة شمسية مدمج، عدسة مزدوجة، بطارية ليثيوم 20,000mAh، ودعم شريحة 4G.
                </p>
              </div>

              {/* Specs Summary Checklist */}
              <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">العدسات</span>
                  <span className="font-bold text-neutral-200">ثابتة 130° + متحركة 355° PTZ</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">مصدر الطاقة</span>
                  <span className="font-bold text-amber-300">لوح شمسي + بطارية ليثيوم مدمجة</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">نوع الاتصال</span>
                  <span className="font-bold text-cyan-300">شريحة 4G SIM لجميع المشغلين</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">التطبيق المعتمد</span>
                  <span className="font-bold text-neutral-200">V380 Pro الرسمي (عربي كامل)</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">الرؤية الليلية</span>
                  <span className="font-bold text-neutral-200">ملونة بالكشافات + أشعة IR خفية</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-neutral-400">الضمان والتوصيل</span>
                  <span className="font-bold text-emerald-400">ضمان ذهبي سنتين + شحن مجاني 58 ولاية</span>
                </div>
              </div>
            </div>

            {/* Bottom Checkout CTA */}
            <div className="space-y-3 pt-6 border-t border-neutral-800 relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">السعر الترويجي الرسمي</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-sans">36,000 د.ج</span>
                    <span className="text-xs text-neutral-400 font-bold">(3 ملايين و 600 ألف)</span>
                    <span className="text-xs text-neutral-500 line-through">48,000 د.ج</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                  وفر 12,000 د.ج
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenReservation();
                  }}
                  className="flex-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-neutral-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب الكاميرا الآن (الدفع عند الاستلام)</span>
                </button>

                {onOpenAR && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenAR();
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-cyan-300 font-bold text-xs border border-cyan-500/40 shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>معاينة في غرفتك (AR)</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
