import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Heart,
  User,
  Copy,
  Check,
  Tag,
  Flame,
  Globe,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DimosTopHeaderBannerProps {
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  cartCount?: number;
  wishlistCount?: number;
  onSelectCategory?: (category: string) => void;
}

export const DimosTopHeaderBanner: React.FC<DimosTopHeaderBannerProps> = ({
  onOpenCart,
  onOpenWishlist,
  cartCount = 0,
  wishlistCount = 0,
  onSelectCategory,
}) => {
  // Midnight Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 9,
    minutes: 19,
    seconds: 27,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="w-full text-right text-xs bg-neutral-950 border-b border-neutral-800 select-none">
      
      {/* 1. Topmost Utility Strip */}
      <div className="bg-neutral-900/90 text-neutral-300 px-4 sm:px-8 py-2 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          
          {/* Contact Numbers & Warehouse link */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:920008317"
              className="flex items-center gap-1.5 text-neutral-200 hover:text-red-400 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>الرقم المجاني: <strong className="font-mono text-white text-xs">920008317</strong></span>
            </a>

            <a
              href="mailto:Hello@dimos.com.sa"
              className="hidden md:flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">Hello@dimos.com.sa</span>
            </a>

            <a
              href="https://maps.app.goo.gl/v59SFPBYoV7mrAWB6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
              title="مستودع واستوديو ديموس بالرياض"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>استوديو ومستودع الرياض (معاينة على الطبيعة)</span>
            </a>
          </div>

          {/* Delivery Scope & B2B / Language */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
              <Truck className="w-3.5 h-3.5" />
              <span>توصيل مجاني (الرياض، القصيم، جدة والدمام)</span>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                const el = document.getElementById('dimos-b2b-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-neutral-300 hover:text-white font-medium transition-colors"
            >
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>Wholesale (B2B)</span>
            </button>

            {/* Language Switch */}
            <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800 text-[10px] font-bold">
              <button
                onClick={() => setActiveLang('ar')}
                className={`px-1.5 py-0.5 rounded ${activeLang === 'ar' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
              >
                ar
              </button>
              <span className="text-neutral-700">|</span>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-1.5 py-0.5 rounded ${activeLang === 'en' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
              >
                en
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Official Promo Code Ticker Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white px-4 py-2 border-b border-red-800/60 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Animated Promo Ticker */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/60 shrink-0">
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold text-xs">
                خصم 55% ما يكفي للاحتفال… زدنا لك 96 ريال عند الدفع
              </span>
              <button
                onClick={() => handleCopyCode('ND96')}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white text-red-950 font-black text-[10px] hover:bg-amber-300 transition-all shadow"
                title="نسخ كود ND96"
              >
                {copiedCode === 'ND96' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span className="font-mono">ND96</span>
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/70 border border-amber-500/40 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs">
                عميل جديد؟ استخدم كود واستمتع بخصم إضافي ٪5
              </span>
              <button
                onClick={() => handleCopyCode('NEWDM')}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-black text-[10px] hover:bg-amber-300 transition-all shadow"
                title="نسخ كود NEWDM"
              >
                {copiedCode === 'NEWDM' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span className="font-mono">NEWDM</span>
              </button>
            </div>
          </div>

          {/* Midnight Flash Sale Countdown */}
          <div className="flex items-center gap-2 bg-neutral-950/90 px-3.5 py-1.5 rounded-xl border border-red-500/50 shrink-0 shadow-md">
            <div className="flex items-center gap-1 text-red-400 font-bold text-xs animate-pulse">
              <Flame className="w-4 h-4 fill-red-500 text-red-500" />
              <span>ينتهي فلاش سيل منتصف الليل خلال:</span>
            </div>
            
            <div className="flex items-center gap-1 font-mono font-black text-xs text-white">
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-300">
                0 <span className="text-[9px] font-sans font-normal text-neutral-400">أيام</span>
              </span>
              <span className="text-red-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')} <span className="text-[9px] font-sans font-normal text-neutral-400">ساعة</span>
              </span>
              <span className="text-red-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')} <span className="text-[9px] font-sans font-normal text-neutral-400">دقيقة</span>
              </span>
              <span className="text-red-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white">
                {String(timeLeft.seconds).padStart(2, '0')} <span className="text-[9px] font-sans font-normal text-red-200">ثانية</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
