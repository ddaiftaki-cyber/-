import React, { useState } from 'react';
import { BENCHMARK_METRICS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { BarChart3, TrendingUp, CheckCircle, ArrowLeft, ShieldCheck, Sun } from 'lucide-react';

export const InteractiveBenchmarks: React.FC = () => {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const activeMetric = BENCHMARK_METRICS[selectedMetricIndex];

  return (
    <section id="benchmarks" className="py-20 relative overflow-hidden bg-neutral-950/80 border-t border-neutral-900 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-bold text-cyan-400 tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مقارنة الأداء الفعلي مع الكاميرات التقليدية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 tracking-tight">
            لماذا تختار كاميرا V380 Pro المزدوجة؟
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            مقارنة تقنية مباشرة توضح تفوق نظام العدستين والشحن الشمسي والاتصال المباشر بشريحة 4G على كاميرات المراقبة القديمة.
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
                      ? 'bg-neutral-900 border-cyan-500/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-400 font-medium">{bench.unit}</div>
                    <div className="text-sm sm:text-base font-bold text-neutral-100">{bench.metric}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold font-sans">
                      {bench.advantageMultiplier}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Left Column (in RTL): Visual Comparison Graph Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800/90 backdrop-blur-xl shadow-2xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs text-cyan-400 font-bold tracking-wider">
                  تحليل مقارنة الأداء
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 mt-1">
                  {activeMetric.metric}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                  {activeMetric.description}
                </p>
              </div>

              <div className="text-right sm:text-left">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-sans">
                  {activeMetric.advantageMultiplier}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  فارق أداء حقيقي
                </div>
              </div>
            </div>

            {/* Visual Comparative Bars */}
            <div className="space-y-6">
              
              {/* V380 Pro Camera Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    كاميرا V380 Pro الشمسية المزدوجة
                  </span>
                  <span className="text-cyan-300 font-bold text-sm font-sans">
                    {activeMetric.auraValue} {activeMetric.unit.split(' ')[0]}
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-neutral-950 border border-neutral-800 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 shadow-lg shadow-cyan-500/30 transition-all duration-700"
                    style={{ width: '96%' }}
                  />
                </div>
              </div>

              {/* Traditional Wi-Fi Camera Bar */}
              <div className="space-y-2 opacity-70">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                    كاميرات الواي فاي السلكية التقليدية
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
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                توفر كاميرا V380 Pro استقلالية تامة عن شبكات الكهرباء والواي فاي، وتمنحك راحة بال تامة ومراقبة مستمرة للموقع من أي هاتف.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
