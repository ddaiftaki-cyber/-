import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  Sun,
  Eye,
  Layers,
  Sparkles,
  ShoppingBag,
  PhoneCall,
  Camera,
  Scan,
  Leaf,
  ZapOff,
  Zap,
  Sliders,
  Settings,
  X,
  Check,
  BatteryMedium,
  Cpu,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ProductConfig } from '../types';

interface NavbarProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
  onOpenAR?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onConfigChange, onOpenReservation, onOpenAR, onOpenTour }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isEco = config.ecoMode ?? false;

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) soundFx.playClick();
  };

  const toggleEcoMode = () => {
    soundFx.playClick();
    const nextEco = !isEco;
    onConfigChange({
      ecoMode: nextEco,
      performanceMode: nextEco ? 'eco' : 'ultra',
    });
    if (nextEco) {
      soundFx.playBeep();
    }
  };

  const scrollToSection = (id: string) => {
    soundFx.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-neutral-800/80 shadow-2xl shadow-neutral-950/60">
        
        {/* Brand Logo & Product Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Sun className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-100 font-sans">
                V380 <span className="text-cyan-400">Pro</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-700/60 font-mono">
                4G Solar Dual
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium hidden sm:inline">
              كاميرا المراقبة الذكية المزدوجة بالطاقة الشمسية
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-300">
          <button
            onClick={() => scrollToSection('camera-control')}
            className="px-3 py-1.5 rounded-lg text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/80 transition-all font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>تشغيل الكاميرا والتحكم 360°</span>
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-neutral-900/80 transition-colors"
          >
            المميزات الذكية
          </button>
          <button
            onClick={() => scrollToSection('inspector')}
            className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-neutral-900/80 transition-colors"
          >
            مكونات الكاميرا 3D
          </button>
          
          {/* AR Room View in Nav */}
          {onOpenAR && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="px-3 py-1.5 rounded-lg text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/80 transition-all font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Scan className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>العرض في غرفتك (AR)</span>
            </button>
          )}

          <button
            onClick={() => scrollToSection('specs')}
            className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-neutral-900/80 transition-colors"
          >
            المواصفات و PDF
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="px-3 py-1.5 rounded-lg hover:text-amber-400 hover:bg-amber-950/30 transition-colors font-bold text-amber-300"
          >
            عروض الشراء 🎁
          </button>
        </nav>

        {/* Action Controls & Fast Order CTA */}
        <div className="flex items-center gap-2.5">
          
          {/* AR Room Button for Mobile */}
          {onOpenAR && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAR();
              }}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-bold"
              title="العرض في غرفتك AR"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AR</span>
            </button>
          )}

          {/* Tour Guide Trigger */}
          {onOpenTour && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenTour();
              }}
              aria-label="بدء الجولة التعليمية التفاعلية"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900/80 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="دليل الاستخدام والجولة التعليمية"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden md:inline">جولة تعليمية</span>
            </button>
          )}

          {/* Eco Mode Quick Toggle Button */}
          <button
            onClick={toggleEcoMode}
            aria-label={isEco ? 'إيقاف وضع توفير الطاقة' : 'تفعيل وضع توفير الطاقة Eco-Mode'}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isEco
                ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-emerald-500/40 hover:text-emerald-400'
            }`}
            title={isEco ? 'وضع توفير الطاقة مفعّل (انقر للتعطيل)' : 'تفعيل وضع توفير الطاقة (Eco-Mode)'}
          >
            <Leaf className={`w-3.5 h-3.5 ${isEco ? 'text-emerald-400' : 'text-neutral-400'}`} />
            <span className="hidden sm:inline">{isEco ? 'Eco نشط' : 'وضع Eco'}</span>
            {isEco && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline" />}
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsSettingsOpen(true);
            }}
            aria-label="إعدادات الأداء والعرض"
            className="w-8 h-8 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
            title="إعدادات الأداء وتوفير الطاقة"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
            className="w-8 h-8 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Direct WhatsApp / Phone Contact */}
          <a
            href="https://wa.me/213652058044?text=السلام%20عليكم%20اريد%20طلب%20كاميرا%20V380%20Pro%20بالطاقة%20الشمسية"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors text-xs font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>0652058044</span>
          </a>

          {/* Primary Purchase Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenReservation();
            }}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-neutral-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن (الدفع عند الاستلام)</span>
          </button>
        </div>

      </div>

      {/* Settings Modal (Eco-Mode & Performance Controls) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xl animate-in fade-in duration-200 text-right">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100">إعدادات الأداء وتوفير الطاقة</h3>
                  <p className="text-xs text-neutral-400">تخصيص سطوع الواجهة ومعدل المعالجة وتحسين البطارية</p>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Eco Mode Master Switch */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isEco
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-neutral-950/60 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isEco ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                      <span>وضع توفير الطاقة (Eco-Mode)</span>
                      {isEco && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-black">
                          مفعل
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      يقلل سطوع الواجهة، يخفف استهلاك كارت الشاشة GPU، ويوقف التحديثات التلقائية غير الضرورية.
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleEcoMode}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    isEco ? 'bg-emerald-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEco ? 'translate-x-0' : '-translate-x-6'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 2. Performance Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-300 block">
                مستوى أداء الرسوميات والمعالجة 3D:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({
                      ecoMode: true,
                      performanceMode: 'eco',
                    });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    config.performanceMode === 'eco'
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50'
                  }`}
                >
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Eco (توفير)</span>
                  <span className="text-[10px] text-neutral-400">أقل استهلاك</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({
                      ecoMode: false,
                      performanceMode: 'balanced',
                    });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    config.performanceMode === 'balanced'
                      ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 ring-2 ring-cyan-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold">متوازن</span>
                  <span className="text-[10px] text-neutral-400">افتراضي سلس</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onConfigChange({
                      ecoMode: false,
                      performanceMode: 'ultra',
                    });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    config.performanceMode === 'ultra'
                      ? 'bg-purple-950/80 border-purple-500/80 text-purple-300 ring-2 ring-purple-500/20'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50'
                  }`}
                >
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold">Ultra (أقصى دقة)</span>
                  <span className="text-[10px] text-neutral-400">توهج كامل 4K</span>
                </button>
              </div>
            </div>

            {/* 3. Status summary */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>استهلاك كارت الشاشة GPU:</span>
                <span className={isEco ? 'text-emerald-400 font-bold' : 'text-neutral-200'}>
                  {isEco ? 'منخفض (Low Power 1.0x)' : 'كامل (Native 2.0x)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>تحديثات الخلفية والتوهج:</span>
                <span className={isEco ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>
                  {isEco ? 'موقفة لتسريع الاستجابة' : 'نشطة بالكامل'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
              >
                حفظ وإغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

