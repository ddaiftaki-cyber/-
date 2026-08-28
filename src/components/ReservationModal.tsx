import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PricingPlan, ProductConfig } from '../types';
import { soundFx } from '../utils/audio';
import { X, CheckCircle2, ShieldCheck, Sparkles, Truck, Box, Download, PhoneCall, ShoppingBag, Gift, ArrowLeft } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  config: ProductConfig;
}

const ALGERIAN_WILAYAS = [
  '01 - أدرار', '02 - الشلف', '03 - الأغواط', '04 - أم البواقي', '05 - باتنة', '06 - بجاية', '07 - بسكرة', '08 - بشار',
  '09 - البليدة', '10 - البويرة', '11 - تمنراست', '12 - تبسة', '13 - تلمسان', '14 - تيارت', '15 - تيزي وزو', '16 - الجزائر العاصمة',
  '17 - الجلفة', '18 - جيجل', '19 - سطيف', '20 - سعيدة', '21 - سكيكدة', '22 - سيدي بلعباس', '23 - عنابة', '24 - قالمة',
  '25 - قسنطينة', '26 - المدية', '27 - مستغانم', '28 - المسيلة', '29 - معسكر', '30 - ورقلة', '31 - وهران', '32 - البيض',
  '33 - إليزي', '34 - برج بوعريريج', '35 - بومرداس', '36 - الطارف', '37 - تندوف', '38 - تسمسيلت', '39 - الوادي', '40 - خنشلة',
  '41 - سوق أهراس', '42 - تيبازة', '43 - ميلة', '44 - عين الدفلى', '45 - النعامة', '46 - عين تموشنت', '47 - غرداية', '48 - غليزان',
  '49 - تيميمون', '50 - برج باجي مختار', '51 - أولاد جلال', '52 - بني عباس', '53 - عين صالح', '54 - عين قزام', '55 - تقرت', '56 - جانت',
  '57 - المغير', '58 - المنيعة'
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  plan,
  config,
}) => {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '16 - الجزائر العاصمة',
    address: '',
    notes: '',
  });
  const [orderCode, setOrderCode] = useState('');

  if (!isOpen) return null;

  const formatPlanPrice = (p: number) => {
    if (p === 36000) return '36,000 د.ج (3 ملايين و 600 ألف)';
    if (p === 68000) return '68,000 د.ج (6 ملايين و 800 ألف)';
    if (p === 130000) return '130,000 د.ج (13 مليون)';
    return `${p.toLocaleString()} د.ج`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    const code = `V380-DZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setStep('confirmed');

    // Confetti celebration
    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#f59e0b', '#10b981', '#ffffff'],
      });
    } catch {}
  };

  const handleDownloadReceipt = () => {
    soundFx.playClick();
    const text = `فاتورة ووصل طلب كاميرا V380 Pro الذكية بالطاقة الشمسية وشريحة 4G
===================================================
رقم الطلب: ${orderCode}
الباقة المختارة: ${plan.name}
المبلغ المطلوب عند الاستلام: ${formatPlanPrice(plan.price)}
المزايا والتوصيل: ${plan.gift || 'توصيل مجاني لـ 58 ولاية + ضمان سنتين'}
لون هيكل الكاميرا: ${config.material.name}
حالة التوصيل: توصيل مجاني لـ 58 ولاية (ما تخلص حتى تسييها وتعجبك)
اسم العميل: ${formData.fullName}
رقم الهاتف: ${formData.phone}
الولاية والبلدية: ${formData.city} - ${formData.address}
ملاحظات العميل: ${formData.notes || 'لا توجد'}
هاتف خدمة العملاء / الدعم: 0652058044
===================================================
الضمان: ضمان ذهبي معتمد لمدة سنتين مع استبدال فوري ودعم فني.
شكراً لاختيارك كاميرا V380 Pro لحماية منزلك ومزرعتك!`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `وصل-طلب-${orderCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-200 text-right">
      <div className="relative w-full max-w-xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 left-5 z-20 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>إتمام الطلب السريع • الدفع عند الاستلام بعد المعاينة والتجربة</span>
              </div>
              <h3 className="text-2xl font-extrabold text-neutral-100">
                طلب {plan.name}
              </h3>
              <p className="text-xs text-neutral-300">
                التوصيل مجاني لـ 58 ولاية • ما تخلصش حتى تسيي الكاميرا وتعجبك.
              </p>
            </div>

            {/* Selected Plan Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400 font-medium">المبلغ المطلوب عند الاستلام:</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 font-sans">{formatPlanPrice(plan.price)}</div>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60 block">
                  توصيل مجاني 58 ولاية
                </span>
                <span className="text-[11px] text-cyan-400 font-bold block pt-1">
                  ضمان شامل سنتين
                </span>
              </div>
            </div>

            {/* Direct Order Quick Call */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold">أو اتصل بنا مباشرة للطلب الفوري:</span>
              <a
                href="tel:0652058044"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black"
              >
                0652058044
              </a>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  الاسم واللقب <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد بن علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  رقم الهاتف للتوصيل <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="06XXXXXXXX / 05XXXXXXXX / 07XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors text-right"
                />
              </div>

              {/* Wilaya & Address in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    الولاية (58 ولاية) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    {ALGERIAN_WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya} className="bg-neutral-900 text-neutral-100">
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    البلدية / العنوان أو موقع المزرعة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اسم البلدية والحي أو المعلم"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  ملاحظات إضافية للموزع (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: يرجى الاتصال قبل الوصول بساعة"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

            </div>

            {/* Guarantees */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ضمان سنتين واستبدال فوري</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>تسييها قبل ما تخلص</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-neutral-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تأكيد إرسال الطلب ({formatPlanPrice(plan.price)})</span>
            </button>

          </form>
        ) : (
          /* Confirmation View */
          <div className="p-8 sm:p-10 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-neutral-100">
                تم استلام طلبك بنجاح! 🎉
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                شكراً لثقتك بنا يا <strong className="text-cyan-400">{formData.fullName}</strong>. تم تسجيل طلبك بنجاح وسيتصل بك موزع التوصيل لتأكيد التسليم لباب منزلك.
              </p>
            </div>

            {/* Order Code Pill */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-xs text-neutral-400 font-medium">رقم وصل الطلب الخاص بك:</span>
              <div className="text-2xl font-black text-cyan-400 font-mono tracking-wider">{orderCode}</div>
              <div className="text-xs text-neutral-500">احتفظ برقم الطلب للمتابعة مع خدمة الزبائن (0652058044)</div>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-neutral-400">الباقة:</span>
                <span className="font-bold text-neutral-100">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المبلغ المطلوب عند الاستلام:</span>
                <span className="font-bold text-amber-400">{formatPlanPrice(plan.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">الولاية والعنوان:</span>
                <span className="font-bold text-neutral-100">{formData.city} - {formData.address}</span>
              </div>
            </div>

            {/* Actions: Download Receipt & Close */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل وصل الطلب</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <span>تم، العودة للصفحة</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
