import React, { useState } from 'react';
import { ProductConfig, MaterialConfig, LightingPreset, WoodFinish, MetalAccent, MarbleType } from '../types';
import {
  MATERIAL_PRESETS,
  WOOD_FINISH_OPTIONS,
  METAL_ACCENT_OPTIONS,
  MARBLE_FINISH_OPTIONS,
} from '../data/productData';
import { soundFx } from '../utils/audio';
import {
  Palette,
  Sun,
  Sparkles,
  Check,
  Sliders,
  Award,
  ShoppingBag,
  Layers,
  Crown,
  Trees,
  Gem,
  CheckCircle2,
  Camera,
} from 'lucide-react';

interface CustomizerStudioProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
  onOpenAR?: () => void;
  onOpenTour?: () => void;
}

const LIGHTING_SALON_PRESETS: { id: LightingPreset; name: string; desc: string }[] = [
  { id: 'warm_majlis', name: 'مجلس سعودي دافئ وفاخر', desc: 'إضاءة ثريات ذهبية ملكية تبرز لمعان المخمل والذهب المطفي' },
  { id: 'daylight_salon', name: 'صالة نهارية مشرقة', desc: 'ضوء نهاري طبيعي يبرز تفاصيل قماش البوكليه وألياف الخشب' },
  { id: 'sunset_luxury', name: 'أجواء غروب الرياض الذهبي', desc: 'درجات عنبرية دافئة تمنح المكان فخامة استثنائية' },
  { id: 'evening_mood', name: 'أجواء ليلية هادئة مع إضاءة الأباجورة', desc: 'إضاءة محيطية ساحرة للراحة والاسترخاء العائلي' },
  { id: 'emerald_palace', name: 'أجواء القصور الملكية', desc: 'إضاءة زمردية وذهبية خاصة بالمناسبات والضيافة الكبرى' },
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  config,
  onConfigChange,
  onOpenReservation,
  onOpenAR,
  onOpenTour,
}) => {
  const handleSelectMaterial = (mat: MaterialConfig) => {
    soundFx.playFabricSwatch();
    onConfigChange({ material: mat });
  };

  const handleSelectWood = (wood: WoodFinish) => {
    soundFx.playClick();
    onConfigChange({ woodFinish: wood });
  };

  const handleSelectMetal = (metal: MetalAccent) => {
    soundFx.playClick();
    onConfigChange({ metalAccent: metal });
  };

  const handleSelectMarble = (marble: MarbleType) => {
    soundFx.playClick();
    onConfigChange({ marbleFinish: marble });
  };

  const handleSelectLighting = (preset: LightingPreset) => {
    soundFx.playClick();
    onConfigChange({ lightingPreset: preset });
  };

  return (
    <section id="customizer" className="py-20 relative overflow-hidden text-right">
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-black text-amber-400 tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>استوديو التخصيص ثلاثي الأبعاد 3D</span>
            </div>

            {onOpenTour && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenTour();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 text-xs font-bold text-amber-300 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>كيف تخصص أثاثك لمجلسك؟</span>
              </button>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
            خصّص أقمشة، أخشاب، ورخام مجلسك بحرية تامة
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            اختر تشكيلة الأقمشة الإيطالية المقاومة للبقع، خشب الزان والجوز الطبيعي، ونوع الرخام والمعادن وشاهد النتيجة فوراً في المجسم ثلاثي الأبعاد.
          </p>
        </div>

        {/* Studio Configurator 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Right Panel (in RTL): Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Luxury Fabrics & Leathers */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>1. نوع ولون القماش الإيطالي الفاخر (معالج بالنانو)</span>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  {config.material.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIAL_PRESETS.map((mat) => {
                  const isSelected = config.material.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => handleSelectMaterial(mat)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/40'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl border-2 border-amber-500/50 shadow-md shrink-0 mt-0.5 flex items-center justify-center"
                        style={{ backgroundColor: mat.bodyColor }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-neutral-100">{mat.name}</div>
                        <div className="text-[11px] text-neutral-400 leading-snug line-clamp-2">{mat.finish}</div>
                        <div className="text-[10px] text-amber-300/90 font-mono font-semibold">{mat.durabilityRubCycles}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Solid Natural Wood Base Finish */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Trees className="w-4 h-4 text-amber-400" />
                  <span>2. تشطيب ونوع خشب الهيكل المصمت</span>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  {WOOD_FINISH_OPTIONS.find((w) => w.id === config.woodFinish)?.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {WOOD_FINISH_OPTIONS.map((wood) => {
                  const isSelected = config.woodFinish === wood.id;
                  return (
                    <button
                      key={wood.id}
                      onClick={() => handleSelectWood(wood.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-400 ring-2 ring-amber-500/20'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: wood.color }} />
                        <span className="text-xs font-bold text-neutral-200 truncate">{wood.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{wood.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Italian Marble & Metal Accent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Marble */}
              <div className="p-5 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
                    <Gem className="w-3.5 h-3.5 text-amber-400" />
                    <span>رخام طاولة القهوة</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {MARBLE_FINISH_OPTIONS.find((m) => m.id === config.marbleFinish)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {MARBLE_FINISH_OPTIONS.map((marble) => {
                    const isSelected = config.marbleFinish === marble.id;
                    return (
                      <button
                        key={marble.id}
                        onClick={() => handleSelectMarble(marble.id)}
                        className={`p-2.5 rounded-xl border text-right text-xs transition-all ${
                          isSelected
                            ? 'bg-neutral-800 border-amber-400 text-amber-300 font-bold'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: marble.color }} />
                          <span className="truncate">{marble.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metal PVD */}
              <div className="p-5 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>أرجل وإطارات التيتانيوم</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {METAL_ACCENT_OPTIONS.find((m) => m.id === config.metalAccent)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {METAL_ACCENT_OPTIONS.map((metal) => {
                    const isSelected = config.metalAccent === metal.id;
                    return (
                      <button
                        key={metal.id}
                        onClick={() => handleSelectMetal(metal.id)}
                        className={`p-2.5 rounded-xl border text-right text-xs transition-all ${
                          isSelected
                            ? 'bg-neutral-800 border-amber-400 text-amber-300 font-bold'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: metal.color }} />
                          <span className="truncate">{metal.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Step 4: Salon Environment Lighting Presets */}
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>3. محاكاة إضاءة الصالة والمجلس السعودي</span>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  {LIGHTING_SALON_PRESETS.find((p) => p.id === config.lightingPreset)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LIGHTING_SALON_PRESETS.map((preset) => {
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

          </div>

          {/* Left Panel (in RTL): Summary Card & Saudi Checkout */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-neutral-900/80 border border-amber-500/30 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                  ملخص مواصفات طلبك المخصص
                </span>
                <span className="text-xs font-mono text-neutral-400">DIMOSS-SOVEREIGN-KSA</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-neutral-100">
                  كنب ديموس الملكي المودولار
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  قماش مخصص <strong className="text-amber-400">{config.material.name}</strong>، قاعدة خشب <strong className="text-amber-300">{WOOD_FINISH_OPTIONS.find((w) => w.id === config.woodFinish)?.name}</strong> مع أرجل <strong className="text-yellow-200">{METAL_ACCENT_OPTIONS.find((m) => m.id === config.metalAccent)?.name}</strong>.
                </p>
              </div>

              {/* Specs Summary Checklist */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">القماش المعتمد</span>
                  <span className="font-bold text-neutral-200">{config.material.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">حشوة المقاعد والراحة</span>
                  <span className="font-bold text-amber-300">اسفنج طبي ميموري فوم HR 45D + ريش</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">الهيكل الداخلي</span>
                  <span className="font-bold text-neutral-200">خشب زان أحمر أوروبي مصمت مجفف</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">مقاومة البقع والقهوة</span>
                  <span className="font-bold text-emerald-400">تقنية النانو المقاومة للسوائل 100%</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                  <span className="text-neutral-400">الضمان والتوصيل في المملكة</span>
                  <span className="font-bold text-amber-400">ضمان ذهبي 10 سنوات + توصيل وتركيب VIP مجاني</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-neutral-400">تقسيط تابي وتمارا</span>
                  <span className="font-bold text-cyan-400">4 دفعات ميسرة بدون أي فوائد (0%)</span>
                </div>
              </div>
            </div>

            {/* Bottom Checkout CTA */}
            <div className="space-y-3 pt-6 border-t border-neutral-800 relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">السعر الإجمالي شامل الضريبة والتوصيل</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-sans">4,950 ر.س</span>
                    <span className="text-xs text-cyan-400 font-bold">أو 1,237 ر.س / شهر (4 دفعات)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                  وفر 1,850 ر.س
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenReservation();
                  }}
                  className="flex-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب بهذا التفصيل (تابي / تمارا / دفع عند التركيب)</span>
                </button>

                {onOpenAR && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenAR();
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold text-xs border border-amber-500/40 shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>معاينة في صالتك (AR)</span>
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
