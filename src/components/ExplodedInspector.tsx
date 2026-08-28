import React from 'react';
import { ProductConfig, HotspotAnnotation } from '../types';
import { HOTSPOT_ANNOTATIONS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { Box, Layers, Sun, Video, RotateCw, Radio, BellRing, Battery, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react';

interface ExplodedInspectorProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  selectedHotspot: HotspotAnnotation | null;
  onSelectHotspot: (hotspot: HotspotAnnotation | null) => void;
}

export const ExplodedInspector: React.FC<ExplodedInspectorProps> = ({
  config,
  onConfigChange,
  selectedHotspot,
  onSelectHotspot,
}) => {
  const activeAnnotation = selectedHotspot || HOTSPOT_ANNOTATIONS[0];

  const handleSelectComponent = (hotspot: HotspotAnnotation) => {
    soundFx.playClick();
    onSelectHotspot(hotspot);
    onConfigChange({
      activeHotspotId: hotspot.id,
      isExploded: true,
    });
  };

  const getCategoryIcon = (category: HotspotAnnotation['category']) => {
    switch (category) {
      case 'SOLAR_POWER':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'OPTICS_DUAL':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'PTZ_MOTOR':
        return <RotateCw className="w-4 h-4 text-purple-400" />;
      case 'SIM_CONNECTIVITY':
        return <Radio className="w-4 h-4 text-sky-400" />;
      case 'AI_SECURITY':
        return <BellRing className="w-4 h-4 text-emerald-400" />;
      case 'BATTERY_CELL':
        return <Battery className="w-4 h-4 text-amber-300" />;
      default:
        return <Box className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="inspector" className="py-20 relative overflow-hidden bg-neutral-950/70 border-t border-b border-neutral-900 text-right">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-wider">
              <Layers className="w-4 h-4" />
              <span>المعاينة الهندسية وتفكيك المكونات 3D</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
              تعرّف على مكونات الكاميرا من الداخل
            </h2>
            <p className="text-neutral-300 max-w-xl text-sm sm:text-base leading-relaxed">
              انقر على أي جزء من أجزاء الكاميرا لمعاينة مواصفاته الدقيقة ودوره في توفير حماية متواصلة بدون أسلاك.
            </p>
          </div>

          {/* Quick Exploded Toggle Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = !config.isExploded;
                soundFx.playExplodeToggle(next);
                onConfigChange({ isExploded: next });
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-lg ${
                config.isExploded
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-cyan-500/25'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{config.isExploded ? 'تجميع الهيكل الكامل' : 'تفكيك جميع أجزاء الكاميرا 3D'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column (in RTL): Components List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-neutral-400 px-1 block">
              اختر أحد مكونات الكاميرا:
            </span>

            <div className="space-y-2.5">
              {HOTSPOT_ANNOTATIONS.map((hotspot) => {
                const isSelected = activeAnnotation.id === hotspot.id;

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => handleSelectComponent(hotspot)}
                    className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-900/90 border-cyan-500/80 shadow-lg shadow-cyan-950/50 scale-[1.01]'
                        : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/30'
                            : 'bg-neutral-800 text-neutral-400 group-hover:text-neutral-200'
                        }`}
                      >
                        {getCategoryIcon(hotspot.category)}
                      </div>

                      <div className="space-y-0.5">
                        <div
                          className={`font-bold text-sm transition-colors ${
                            isSelected ? 'text-cyan-400' : 'text-neutral-200 group-hover:text-neutral-100'
                          }`}
                        >
                          {hotspot.title}
                        </div>
                        <div className="text-xs text-neutral-400">{hotspot.subtitle}</div>
                      </div>
                    </div>

                    <ChevronLeft
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-400 -translate-x-1' : 'text-neutral-600 group-hover:text-neutral-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Column (in RTL): Selected Component Blueprint & Deep Specs */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Component Badge & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 font-bold">
                    {activeAnnotation.category}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span>المكون النشط في النموذج ثلاثي الأبعاد</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                  {activeAnnotation.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed pt-1">
                  {activeAnnotation.description}
                </p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-neutral-300">
                  المواصفات التقنية للمكون:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAnnotation.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col justify-between"
                    >
                      <span className="text-xs text-neutral-400">{spec.label}</span>
                      <span className="font-bold text-sm text-cyan-300 pt-1 font-sans">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Hook & Quick Help */}
              <div className="pt-4 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>مكون أصلي معتمد بجودة صناعية عالية</span>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    const heroEl = document.getElementById('hero');
                    if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <span>تدوير ومعاينة الكاميرا 360°</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
