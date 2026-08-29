import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { PricingPlan, ProductConfig } from '../types';
import { Check, Sparkles, Shield, ArrowLeft, Truck, RefreshCw, Zap, Gift, ShoppingBag, ShieldCheck, Crown, CreditCard } from 'lucide-react';

interface PricingTiersProps {
  config: ProductConfig;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingTiers: React.FC<PricingTiersProps> = ({ config, onSelectPlan }) => {
  const [currency, setCurrency] = useState<'SAR'>('SAR');

  const formatPrice = (amount: number) => {
    return `${amount.toLocaleString()} ر.س`;
  };

  const calculateTabby = (amount: number) => {
    return Math.round(amount / 4);
  };

  return (
    <section id="pricing" className="py-20 relative overflow-hidden bg-neutral-950/80 border-t border-neutral-900 text-right">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/50 text-xs font-black text-amber-300 tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>عروض الموسم • توصيل وتركيب فندقي مجاني لجميع مناطق المملكة 🇸🇦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
            اختر تشكيلة ديموس المناسبة لمجلسك وصالتك
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            استمتع بأعلى معايير الفخامة الإيطالية مع خيارات التقسيط المريح على 4 دفعات بدون فوائد عبر <strong className="text-emerald-400 font-bold">تابي (Tabby)</strong> و <strong className="text-amber-400 font-bold">تمارا (Tamara)</strong>.
          </p>

          {/* Quick Direct Customer Service Call / WhatsApp */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="tel:0501234567"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300 hover:bg-amber-900/80 text-xs font-black transition-all shadow-lg"
            >
              <span>📞 استشارة مهندس الديكور: 0501234567</span>
            </a>
            <a
              href="https://wa.me/966501234567?text=السلام%20عليكم%20اريد%20الاستفسار%20عن%20مفروشات%20ديموس%20وتفصيل%20المجلس"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80 text-xs font-black transition-all shadow-lg"
            >
              <span>💬 واتساب مبيعات ديموس VIP</span>
            </a>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isRec = plan.recommended;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-xl ${
                  isRec
                    ? 'bg-neutral-900/90 border-2 border-amber-400 shadow-2xl shadow-amber-950/60 lg:-translate-y-2'
                    : 'bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                {/* Floating Top Badge */}
                {plan.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black shadow-lg ${
                      isRec
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 shadow-amber-500/30'
                        : 'bg-neutral-800 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Description */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl font-black text-neutral-100">{plan.name}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 font-sans">
                        {formatPrice(plan.price)}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through font-sans">
                          {formatPrice(plan.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Tabby & Tamara Installment Banner */}
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>أو قسّمها على 4 دفعات:</span>
                      </div>
                      <span className="font-bold text-amber-300 font-mono">
                        {calculateTabby(plan.price)} ر.س / شهر
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                      <span>شامل ضريبة القيمة المضافة</span>
                      <span className="text-emerald-400 font-bold">توصيل وتركيب مجاني</span>
                    </div>
                  </div>

                  {/* Gift / Special Offer banner */}
                  {plan.gift && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>هدية التشكيلة: {plan.gift}</span>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold text-neutral-300 block">المواصفات والمحتويات المشمولة:</span>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 mt-6 border-t border-neutral-800 space-y-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectPlan(plan);
                    }}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                      isRec
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-neutral-950 shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 hover:border-amber-500/50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>طلب {plan.name.split('(')[0]} الآن</span>
                  </button>

                  <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{plan.deliveryDate}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust Row */}
        <div className="mt-12 p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 flex flex-col md:flex-row items-center justify-around gap-6 text-xs text-neutral-300 text-center md:text-right">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-100">توصيل وتركيب فندقي مجاني</div>
              <div className="text-neutral-400">كافة مدن المملكة (الرياض، جدة، مكة، الدمام، المدينة...)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-100">ضمان ديموس الذهبي 10 سنوات</div>
              <div className="text-neutral-400">ضمان شامل على الهيكل الخشبي ونظام النوابض والاسفنج</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-100">تقسيط مريح عبر تابي وتمارا</div>
              <div className="text-neutral-400">4 دفعات ميسرة بدون أي فوائد أو رسوم خفية</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
