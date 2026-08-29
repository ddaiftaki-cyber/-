import React, { useState } from 'react';
import { FAQS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { DimossLogo } from './DimossLogo';
import {
  ChevronDown,
  Crown,
  ArrowUp,
  Send,
  CheckCircle2,
  Shield,
  PhoneCall,
  ShieldCheck,
  CreditCard,
  Truck,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    soundFx.playClick();
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    soundFx.playSuccess();
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 4000);
  };

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-neutral-950 border-t border-neutral-900 pt-20 pb-12 overflow-hidden text-right">
      
      {/* FAQ Section */}
      <div id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-black text-amber-400 tracking-wider">
            الأسئلة الشائعة والإجابات • ديموس للمفروشات
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-100">
            كل ما تود معرفته عن مفروشات ديموس والخدمات
          </h2>
          <p className="text-sm text-neutral-400">
            إجابات واضحة حول خيارات التقسيط (تابي وتمارا)، التوصيل للمناطق، الضمان الذهبي، وخدمة إرسال عينات الأقمشة مجاناً.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-900/40 border border-neutral-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 text-sm font-bold text-neutral-200 hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900 pt-12 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl shadow-red-950/30 border border-neutral-200 inline-block">
                <DimossLogo variant="full" size="md" />
              </div>
            </div>
            <p className="text-xs text-neutral-300 max-w-sm leading-relaxed">
              العلامة الرائدة في تصميم وتصنيع أطقم الكنب والمجالس الملكية والمفروشات الفاخرة في المملكة العربية السعودية، نجمع بين فخامة الخشب الطبيعي وتقنيات أقمشة النانو الذكية.
            </p>

            {/* Guarantees Badges */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-3 w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>ضمان ذهبي 10 سنوات • توصيل وتركيب فندقي مجاني لجميع مناطق المملكة</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold text-neutral-200">أقسام المعرض</span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#hero" className="hover:text-amber-400 transition-colors">
                  معاينة الكنب في الاستوديو 3D
                </a>
              </li>
              <li>
                <a href="#ar-room" className="hover:text-amber-400 transition-colors">
                  معاينة الكنب في صالتك (AR الواقع المعزز)
                </a>
              </li>
              <li>
                <a href="#customizer" className="hover:text-amber-400 transition-colors">
                  مختبر تخصيص الألوان والأقمشة
                </a>
              </li>
              <li>
                <a href="#inspector" className="hover:text-amber-400 transition-colors">
                  فحص طبقات الجودة والهيكل الخشبي
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-amber-400 transition-colors">
                  المواصفات الفنية والمقاسات
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  باقات التشكيلات وعروض تابي وتمارا
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Instant WhatsApp Support */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold text-neutral-200 block">
              انضم لنادي عملاء ديموس VIP
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              سجل رقم جوالك أو بريدك الإلكتروني ليصلك كتالوج الموسم الجديد وكوبونات الخصم الحصرية.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="رقم الجوال أو البريد الإلكتروني"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>اشتراك</span>
                </button>
              </div>

              {newsletterSubmitted && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>شكراً لك! تم انضمامك لقائمة عملاء ديموس VIP بنجاح.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} مفروشات ديموس الفاخرة (DIMOSS Saudi Arabia). جميع الحقوق محفوظة.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-all text-xs font-bold"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
