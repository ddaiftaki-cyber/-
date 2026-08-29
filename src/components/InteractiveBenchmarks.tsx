import React, { useState } from 'react';
import { BENCHMARK_METRICS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { BarChart3, CheckCircle, ShieldCheck, Award, Crown, Droplets, Sparkles } from 'lucide-react';

export const InteractiveBenchmarks: React.FC = () => {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const activeMetric = BENCHMARK_METRICS[selectedMetricIndex];

  return (
    <section id="benchmarks" className="py-20 relative overflow-hidden bg-neutral-950/80 border-t border-neutral-900 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-xs font-black text-amber-400 tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مقارنة الجودة والمواصفات المعيارية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
            لماذا تختار مفروشات ديموس الفاخرة؟
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            مقارنة تقنية مباشرة توضح تفوق خامات ديموس المصنوعة من خشب الزان الأوروبي والاسفنج الطبي HR 45D على الأثاث التجاري سريع الهبوط.
          </p>
        </div>

        {/* Benchmarks Interactive Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Column (in RTL): Metric Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {BENCHMARK_METRICS.map((bench, idx) => {
              const isSelected = selectedMetricIndex === idx;
              return (
                <button
                  key={bench.metric}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedMetricIndex(idx);
                  }}
                  className={`w-full text-right p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/30'
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-400 font-medium">{bench.unit}</div>
                    <div className="text-sm sm:text-base font-bold text-neutral-100">{bench.metric}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-black font-sans">
                      {bench.advantageMultiplier}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Left Column (in RTL): Visual Comparison Graph Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs text-amber-400 font-black tracking-wider">
                  تحليل المتانة ومقارنة الاستدامة
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-100 mt-1">
                  {activeMetric.metric}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                  {activeMetric.description}
                </p>
              </div>

              <div className="text-right sm:text-left">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-sans">
                  {activeMetric.advantageMultiplier}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  فارق متانة حقيقي
                </div>
              </div>
            </div>

            {/* Visual Comparative Bars */}
            <div className="space-y-6">
              
              {/* Dimoss Sovereign Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    مفروشات ديموس الإيطالية (DIMOSS)
                  </span>
                  <span className="text-amber-300 font-black text-sm font-sans">
                    {activeMetric.auraValue} {activeMetric.unit.split(' ')[0]}
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-neutral-950 border border-neutral-800 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30 transition-all duration-700"
                    style={{ width: '96%' }}
                  />
                </div>
              </div>

              {/* Commercial Furniture Bar */}
              <div className="space-y-2 opacity-70">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                    الكنب التجاري العادي في السوق
                  </span>
                  <span className="text-neutral-400 font-bold text-sm font-sans">
                    {activeMetric.industryAverage} {activeMetric.unit.split(' ')[0]}
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-neutral-950 border border-neutral-800 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-neutral-700 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(15, (activeMetric.industryAverage / activeMetric.auraValue) * 100))}%`,
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Bottom Key takeaway message */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                تستثمر ديموس في أجود أنواع خشب الزان الأحمر وأقمشة النانو الإيطالية لضمان بقاء مجلسك بأناقته الكاملة لسنوات طويلة دون أي تلف أو هبوط.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
