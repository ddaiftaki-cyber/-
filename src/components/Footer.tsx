import React, { useState } from 'react';
import { FAQS } from '../data/productData';
import { soundFx } from '../utils/audio';
import { ChevronDown, Video, ArrowUp, Send, CheckCircle2, Shield, PhoneCall, ShieldCheck, Sun, Wifi, MessageCircle } from 'lucide-react';

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
          <span className="text-xs font-bold text-cyan-400 tracking-wider">
            الأسئلة الشائعة والإجابات
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100">
            كل ما تود معرفته عن الكاميرا
          </h2>
          <p className="text-sm text-neutral-400">
            إجابات دقيقة لأهم الأسئلة حول التثبيت، شريحة 4G، وتطبيق V380 Pro.
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
                  className="w-full p-5 text-right flex items-center justify-between gap-4 text-sm font-bold text-neutral-200 hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Video className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-neutral-100">
                V380 Pro <span className="text-cyan-400 text-xs">SOLAR 4G DUAL</span>
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-sm leading-relaxed">
              كاميرا المراقبة الذكية المزدوجة الخارجية الأولى المزودة بلوح طاقة شمسية مدمج وشريحة 4G SIM لتأمين المنازل، المزارع، والمستودعات في أي مكان بدون أسلاك.
            </p>

            {/* Guarantees Badges */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-3 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ضمان سنتين ذهبي مع استبدال فوري ودعم فني عربي</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold text-neutral-200">روابط سريعة</span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition-colors">
                  معاينة الكاميرا 3D
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-cyan-400 transition-colors">
                  المميزات والتقنيات
                </a>
              </li>
              <li>
                <a href="#inspector" className="hover:text-cyan-400 transition-colors">
                  تفكيك الأجزاء الهندسية
                </a>
              </li>
              <li>
                <a href="#customizer" className="hover:text-cyan-400 transition-colors">
                  استوديو التخصيص 3D
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-cyan-400 transition-colors">
                  المواصفات الفنية
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                  الباقات والأسعار المخفضة
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Instant WhatsApp Support */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold text-neutral-200 block">
              احصل على خصم إضافي وعروض التوفير
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              سجل بريدك الإلكتروني أو رقم هاتفك لتصلك أحدث عروض كاميرات المراقبة وملحقات الطاقة الشمسية.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="بريدك الإلكتروني أو رقم الواتساب"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>اشتراك</span>
                </button>
              </div>

              {newsletterSubmitted && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>شكراً لك! تم تسجيلك بنجاح في قائمة العروض الحصرية.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} كاميرا V380 Pro Solar 4G Dual Lens. جميع الحقوق محفوظة.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs font-bold"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
