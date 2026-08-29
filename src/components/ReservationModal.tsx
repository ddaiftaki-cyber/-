import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PricingPlan, ProductConfig, DimosProduct } from '../types';
import { soundFx } from '../utils/audio';
import { DimossLogo } from './DimossLogo';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Truck,
  Box,
  Download,
  PhoneCall,
  ShoppingBag,
  Gift,
  ArrowLeft,
  Crown,
  CreditCard,
  Building,
} from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  config: ProductConfig;
  customProduct?: DimosProduct | null;
}

const SAUDI_CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الأحساء',
  'القصيم (بريدة / عنيزة)',
  'الطائف',
  'أبها وخميس مشيط',
  'تبوك',
  'حائل',
  'جازان',
  'نجران',
  'ينبع',
  'الجبيل',
  'حفر الباطن',
  'الخرج',
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  plan,
  config,
  customProduct = null,
}) => {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'tabby' | 'tamara' | 'card' | 'cod'>('tabby');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'الرياض',
    district: '',
    notes: '',
  });
  const [orderCode, setOrderCode] = useState('');

  if (!isOpen) return null;

  const activeTitle = customProduct ? customProduct.title : plan.name;
  const activePrice = customProduct ? customProduct.price : plan.price;

  const formatPlanPrice = (p: number) => {
    return `${p.toLocaleString()} ر.س`;
  };

  const calculateTabby = (amount: number) => {
    return Math.round(amount / 4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    const code = `DIMOSS-KSA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setStep('confirmed');

    // Confetti celebration
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fef08a', '#10b981', '#ffffff'],
      });
    } catch {}
  };

  const handleDownloadReceipt = () => {
    soundFx.playClick();
    const text = `فاتورة وعقد حجز مفروشات ديموس الفاخرة • DIMOSS KSA
===================================================
رقم الحجز: ${orderCode}
التشكيلة المختارة: ${plan.name}
المبلغ الإجمالي: ${formatPlanPrice(plan.price)}
خيار السداد: ${paymentMethod === 'tabby' ? 'تقسيط تابي (4 دفعات بدون فوائد)' : paymentMethod === 'tamara' ? 'تقسيط تمارا (4 دفعات بدون فوائد)' : paymentMethod === 'card' ? 'مدى / بطاقة ائتمانية' : 'الدفع عند الاستلام والتركيب'}
الدفعة الشهرية (في حال التقسيط): ${calculateTabby(plan.price)} ر.س / شهر
نوع ولون القماش: ${config.material.name} (${config.fabricType})
نوع الخشب والتشطيب: ${config.woodFinish}
نوع المعدن: ${config.metalAccent}
المدينة والحي: ${formData.city} - ${formData.district}
اسم العميل: ${formData.fullName}
رقم الجوال: ${formData.phone}
ملاحظات الطلب: ${formData.notes || 'لا توجد'}
===================================================
الضمان: الضمان الذهبي الشامل لمدة 10 سنوات على الهيكل الخشبي ونظام النوابض والاسفنج.
التوصيل والتركيب: مجاني 100% لفريق ديموس الفني الفندقي.
خدمة العملاء VIP: 0501234567
شكراً لاختيارك مفروشات ديموس لمنزلك الفاخر!`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `حجز-ديموس-${orderCode}.txt`;
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
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg bg-white shadow-sm border border-neutral-200 inline-block">
                  <DimossLogo variant="full" size="sm" />
                </div>
                <span className="text-[11px] font-black text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/40">
                  طلب رسمي معتمد
                </span>
              </div>
              <h3 className="text-2xl font-black text-neutral-100">
                طلب وتفصيل {activeTitle}
              </h3>
              <p className="text-xs text-neutral-300">
                توصيل وتركيب فندقي مجاني لكافة مدن المملكة • خيارات تقسيط ميسرة تابي وتمارا.
              </p>
            </div>

            {/* Selected Plan Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400 font-medium">السعر الإجمالي شامل الضريبة:</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 font-sans">{formatPlanPrice(activePrice)}</div>
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60 block">
                  أو {calculateTabby(activePrice)} ر.س / شهر
                </span>
                <span className="text-[11px] text-amber-300 font-bold block pt-1">
                  ضمان ذهبي 10 سنوات
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-300">طريقة الدفع أو التقسيط:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPaymentMethod('tabby');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    paymentMethod === 'tabby'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-black text-xs">تابي Tabby</span>
                  <span className="text-[10px]">4 دفعات 0%</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPaymentMethod('tamara');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    paymentMethod === 'tamara'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-black text-xs">تمارا Tamara</span>
                  <span className="text-[10px]">4 دفعات 0%</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPaymentMethod('card');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'bg-neutral-800 border-amber-400 text-neutral-100 ring-2 ring-amber-500/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-black text-xs">مدى / بطاقة</span>
                  <span className="text-[10px]">دفع فوري</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPaymentMethod('cod');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    paymentMethod === 'cod'
                      ? 'bg-neutral-800 border-amber-400 text-neutral-100 ring-2 ring-amber-500/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-black text-xs">عند الاستلام</span>
                  <span className="text-[10px]">بعد التركيب</span>
                </button>

              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  الاسم الكامل <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فيصل بن عبدالعزيز"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  رقم الجوال السعودي للتوصيل والتنسيق <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors text-right"
                />
              </div>

              {/* City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    المدينة <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    {SAUDI_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-neutral-900 text-neutral-100">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    الحي / الشارع أو الفيلا <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الحي والشارع"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Custom specs notes */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  ملاحظات أو تعديلات خاصة على المقاسات (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: يرجى جعل الزاوية جهة اليمين أو إرسال عينات الأقمشة مسبقاً"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

            </div>

            {/* Guarantees */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ضمان ديموس الذهبي 10 سنوات</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>توصيل وتركيب فندقي مجاني</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تأكيد حجز التشكيلة ({formatPlanPrice(plan.price)})</span>
            </button>

          </form>
        ) : (
          /* Confirmation View */
          <div className="p-8 sm:p-10 space-y-6 text-center">
            
            <div className="flex justify-center">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl shadow-red-950/20 border border-neutral-200">
                <DimossLogo variant="full" size="sm" />
              </div>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-neutral-100">
                تم تأكيد حجزك في ديموس بنجاح! 👑
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                شكراً لاختيارك مفروشات ديموس يا <strong className="text-amber-400">{formData.fullName}</strong>. سيتواصل معك مستشار الديكور لتأكيد المقاسات وموعد التوصيل والتركيب الفندقي.
              </p>
            </div>

            {/* Order Code Pill */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-xs text-neutral-400 font-medium">رقم حجز عقد المفروشات:</span>
              <div className="text-2xl font-black text-amber-400 font-mono tracking-wider">{orderCode}</div>
              <div className="text-xs text-neutral-500">احتفظ برقم الحجز للمتابعة مع خدمة عملاء ديموس VIP (0501234567)</div>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-neutral-400">التشكيلة:</span>
                <span className="font-bold text-neutral-100">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المبلغ الإجمالي:</span>
                <span className="font-bold text-amber-400">{formatPlanPrice(plan.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المدينة والحي:</span>
                <span className="font-bold text-neutral-100">{formData.city} - {formData.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">طريقة الدفع:</span>
                <span className="font-bold text-emerald-400">
                  {paymentMethod === 'tabby' ? 'تقسيط تابي (4 دفعات)' : paymentMethod === 'tamara' ? 'تقسيط تمارا (4 دفعات)' : paymentMethod === 'card' ? 'مدى / بطاقة' : 'عند الاستلام والتركيب'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل وثيقة الحجز والضمان</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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
