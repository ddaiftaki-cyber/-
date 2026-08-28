import React, { useState } from 'react';
import { TECH_SPECS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { generateTechSpecsPDF } from '../utils/pdfGenerator';
import {
  SlidersHorizontal,
  Check,
  Video,
  Sun,
  Wifi,
  BellRing,
  Shield,
  ShieldCheck,
  Download,
  FileText,
  Loader2,
  Printer,
  Sparkles,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  X,
} from 'lucide-react';

export const TechSpecsSheet: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = ['ALL', ...TECH_SPECS.map((g) => g.category)];

  const filteredGroups =
    selectedCategory === 'ALL'
      ? TECH_SPECS
      : TECH_SPECS.filter((g) => g.category === selectedCategory);

  const getCategoryIcon = (name: string) => {
    if (name.includes('العدسات') || name.includes('التصوير')) return <Video className="w-4 h-4 text-cyan-400" />;
    if (name.includes('الشمسية') || name.includes('البطارية')) return <Sun className="w-4 h-4 text-amber-400" />;
    if (name.includes('الاتصال') || name.includes('V380')) return <Wifi className="w-4 h-4 text-purple-400" />;
    if (name.includes('الأمان') || name.includes('الإنذار')) return <BellRing className="w-4 h-4 text-emerald-400" />;
    return <Shield className="w-4 h-4 text-sky-400" />;
  };

  const handleDownloadPDF = async () => {
    soundFx.playClick();
    setIsGeneratingPDF(true);
    try {
      await generateTechSpecsPDF();
      soundFx.playSuccess();
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrintSpecs = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <section id="specs" className="py-20 relative overflow-hidden bg-neutral-950 text-right">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with PDF Download CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-neutral-900 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-black text-cyan-300 tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>جدول المواصفات الفنية التفصيلية • DOC-REF: V380-DZ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
              المواصفات التقنية الكاملة
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              جميع تفاصيل العدسات المزدوجة، لوح الطاقة الشمسية، شريحة 4G، وتطبيق V380 Pro المعتمد رسمياً من الشركة المصنعة.
            </p>
          </div>

          {/* Action Buttons: Download PDF & Preview */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Quick Preview Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsPreviewOpen(true);
              }}
              className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>معاينة البطاقة التقنية</span>
            </button>

            {/* Primary PDF Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/20 active:scale-[0.98] ${
                pdfSuccess
                  ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-neutral-950 hover:scale-[1.02]'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>جاري توليد ملف PDF عالي الدقة...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                  <span>تم تحميل ملف PDF بنجاح! 🎉</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-neutral-950" />
                  <span>تحميل البطاقة التقنية (ملف PDF رسمي)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Pills & PDF summary indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-neutral-100 hover:border-neutral-700'
                  }`}
                >
                  {cat === 'ALL' ? 'جميع المواصفات' : cat}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-neutral-400 font-mono">
            <span>شهادات الجودة: </span>
            <strong className="text-cyan-400">CE • FCC • RoHS • IP66</strong>
          </div>
        </div>

        {/* Specs Table Groups */}
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 overflow-hidden backdrop-blur-md shadow-xl"
            >
              {/* Group Header */}
              <div className="px-6 py-4 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(group.category)}
                  <h3 className="text-base font-bold text-neutral-200">{group.category}</h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-800/50">
                  معتمد ومختبر 100%
                </span>
              </div>

              {/* Items Rows */}
              <div className="divide-y divide-neutral-800/60">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="md:col-span-4 text-xs font-bold text-neutral-400">
                      {item.name}
                    </div>
                    <div className="md:col-span-8 flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          item.highlight ? 'text-cyan-300 font-bold' : 'text-neutral-200'
                        }`}
                      >
                        {item.value}
                      </span>
                      {item.highlight && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-sans">
                          ميزة ممتازة
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Quick PDF Download Reminder */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-100">
                هل تحتاج لنسخة مطبوعة أو إرسال المواصفات للعميل أو الفني؟
              </h4>
              <p className="text-xs text-neutral-300 mt-1">
                يمكنك تحميل كتيب المواصفات الفنية المعتمد بصيغة PDF جاهز للطباعة والمشاركة الفورية.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>تحميل ملف PDF التقني</span>
          </button>
        </div>

      </div>

      {/* PDF Quick Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-200 text-right">
          <div className="relative w-full max-w-3xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-neutral-100">
                    معاينة البطاقة التقنية لكاميرا V380 Pro
                  </h3>
                  <span className="text-xs text-neutral-400">DOC-REF: V380-DZ-TECH-2026</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Document Body (Scrollable Sheet) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-neutral-950 text-xs leading-relaxed font-sans">
              
              {/* Document Letterhead */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-cyan-400 font-bold text-[11px]">📄 البطاقة التقنية الرسمية المعتمدة</div>
                  <div className="text-lg font-black text-white mt-1">كاميرا V380 Pro المزدوجة 4G بالطاقة الشمسية</div>
                  <div className="text-neutral-400 text-[11px]">V380 Pro 4K Dual-Lens Solar & 4G LTE Autonomous Camera</div>
                </div>
                <div className="text-left font-mono">
                  <div className="text-amber-400 font-bold text-sm">36,000 د.ج</div>
                  <div className="text-neutral-500 text-[10px]">ضمان سنتين • 58 ولاية</div>
                </div>
              </div>

              {/* Highlights 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                  <div className="text-cyan-400 font-bold">العدسات</div>
                  <div className="text-neutral-200 font-bold mt-0.5">4K Dual Lens 360°</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                  <div className="text-amber-400 font-bold">البطارية</div>
                  <div className="text-neutral-200 font-bold mt-0.5">20,000mAh Solar</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                  <div className="text-emerald-400 font-bold">الشبكة</div>
                  <div className="text-neutral-200 font-bold mt-0.5">4G LTE (58 ولاية)</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                  <div className="text-purple-400 font-bold">العزل</div>
                  <div className="text-neutral-200 font-bold mt-0.5">IP66 Weatherproof</div>
                </div>
              </div>

              {/* Specs Groups Preview */}
              <div className="space-y-4">
                {TECH_SPECS.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="text-cyan-400 font-bold text-xs pb-2 border-b border-neutral-800 flex items-center justify-between">
                      <span>{idx + 1}. {g.category}</span>
                      <span className="text-neutral-500 font-mono text-[10px]">مواصفة معتمدة</span>
                    </div>
                    <div className="divide-y divide-neutral-800/60 pt-1">
                      {g.items.map((item, i) => (
                        <div key={i} className="py-1.5 flex justify-between gap-4">
                          <span className="text-neutral-400 font-medium">{item.name}:</span>
                          <span className={item.highlight ? 'text-cyan-300 font-bold' : 'text-neutral-200'}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Algerian Delivery & Warranty Footer */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-emerald-300 font-bold">🇩🇿 التوصيل والدفع في الجزائر:</div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    توصيل مجاني لكافة الـ 58 ولاية • الدفع عند الاستلام بعد التجربة والمعاينة • هاتف الطلبات: 0652058044
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                جاهز للتنزيل المباشر بصيغة PDF عالية الدقة
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
                >
                  إغلاق
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-black transition-all flex items-center gap-1.5"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>تحميل ملف PDF الآن</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

