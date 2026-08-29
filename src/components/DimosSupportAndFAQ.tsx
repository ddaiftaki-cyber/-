import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  Percent,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Building2,
  Sparkles,
} from 'lucide-react';
import { DIMOS_FAQS_OFFICIAL, DIMOS_CUSTOMER_REVIEWS } from '../data/dimosStoreData';
import { soundFx } from '../utils/audio';

interface DimosSupportAndFAQProps {
  onOpenReservation?: () => void;
  onOpenAR?: () => void;
}

export const DimosSupportAndFAQ: React.FC<DimosSupportAndFAQProps> = ({ onOpenReservation, onOpenAR }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const toggleFaq = (index: number) => {
    soundFx.playClick();
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    soundFx.playClick();
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 text-right py-16 px-4 sm:px-8 border-t border-neutral-800 space-y-20">
      
      {/* 1. Value Badges & Guarantees Strip */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100">نطاق التوصيل المجاني</div>
              <div className="text-[11px] text-neutral-400">الرياض، القصيم، جدة والدمام</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100">الاستلام متاح فوراً</div>
              <div className="text-[11px] text-amber-400">مستودع واستوديو الرياض</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100">إمكانية الإرجاع خلال 14 يومًا</div>
              <div className="text-[11px] text-emerald-400">استرجاع واستبدال مرن</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100">تسوق آمن بنسبة 100%</div>
              <div className="text-[11px] text-blue-300">مدى • فيزا • تابي • تمارا</div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Frequently Asked Questions (الأسئلة الشائعة) */}
      <div id="dimos-faq-section" className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>خدمة عملاء ديموس</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-100">
            الأسئلة الشائعة حول الطلب والتجربة والضمان
          </h2>
          <p className="text-xs text-neutral-400">
            كل ما يهمك معرفته حول تجربة كنب ديموس في منزلك وطرق الدفع والتوصيل المجاني.
          </p>
        </div>

        <div className="space-y-3">
          {DIMOS_FAQS_OFFICIAL.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden transition-all duration-200 hover:border-neutral-700"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center shrink-0">
                      ؟
                    </span>
                    <span className="font-extrabold text-sm text-neutral-100">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 space-y-3 animate-in fade-in duration-200">
                    <p>{faq.a}</p>

                    {/* Google Maps link if warehouse question */}
                    {idx === 0 && (
                      <div className="pt-2">
                        <a
                          href="https://maps.app.goo.gl/v59SFPBYoV7mrAWB6"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-md"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>فتح موقع استوديو مستودع الرياض على خرائط Google 🗺️</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Call Direct if Discount Question */}
                    {idx === 3 && (
                      <div className="pt-2">
                        <a
                          href="tel:920008317"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-colors shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>الاتصال بالرقم المجاني: 920008317</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Verified Customer Reviews (من عملائنا) */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-100">
                من عملائنا (تقييمات موثقة)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 text-xs font-bold">
                موثق ✓
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              تجارب حقيقية لعملاء ديموس في مختلف مناطق المملكة العربية السعودية
            </p>
          </div>

          {/* Rating aggregate score */}
          <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2.5 rounded-2xl border border-neutral-800">
            <div className="text-2xl font-black text-amber-400">4.8</div>
            <div className="space-y-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-neutral-400 font-bold">(26 مراجعة موثقة)</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIMOS_CUSTOMER_REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-neutral-200 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800/80">
                مشتري مؤكد • مفروشات ديموس
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Wholesale (B2B) Section */}
      <div id="dimos-b2b-section" className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>مبيعات الجملة والمشاريع والفنادق (Wholesale B2B)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-100">
              تأثيث الفنادق والمقاهي والشركات بأعلى معايير الجودة والضمان
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
              نوفر أسعار جملة حصرية للشركات والمطورين العقاريين ومهندسي الديكور مع خيارات تفصيل مخصصة بأقمشة مضادة للحريق وسريعة التسليم.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <a
              href="mailto:Hello@dimos.com.sa?subject=طلب%20عرض%20سعر%20مشاريع%20B2B"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs text-center transition-colors shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>طلب عرض سعر مشاريع (B2B)</span>
            </a>

            <a
              href="tel:920008317"
              className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs text-center border border-neutral-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>اتصال المبيعات: 920008317</span>
            </a>
          </div>
        </div>
      </div>

      {/* 5. Newsletter Signup */}
      <div className="max-w-xl mx-auto text-center space-y-4 pt-4">
        <h4 className="text-base font-bold text-neutral-100">
          احصل على آخر عروض وفلاش سيل ديموس 📬
        </h4>
        <p className="text-xs text-neutral-400">
          من خلال تقديم بريدك الإلكتروني، فإنك توافق على سياسة الخصوصية والشروط والأحكام الخاصة بنا.
        </p>

        {newsletterSuccess ? (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-bold animate-in fade-in">
            تم تسجيل بريدك بنجاح! سنرسل لك أحدث أكواد الخصم والتشكيلات الحصرية ✨
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-red-500 text-right"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shrink-0 shadow-md shadow-red-900/30"
            >
              اشتراك
            </button>
          </form>
        )}
      </div>

      {/* 6. Legal & Tax Verification Footer Info */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
        <div className="flex flex-wrap items-center gap-4 font-mono">
          <span>سجل تجاري: <strong className="text-neutral-400 font-bold">CR Number: 7010703663</strong></span>
          <span>الرقم الضريبي: <strong className="text-neutral-400 font-bold">Tax Number: 311160220200003</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span>جميع الحقوق محفوظة © مفروشات ديموس السعودية (Dimos Furniture)</span>
        </div>
      </div>

    </div>
  );
};
