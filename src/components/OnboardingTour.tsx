import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import {
  Sparkles,
  Sliders,
  Camera,
  Scan,
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Eye,
  RotateCw,
  Sun,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAR?: () => void;
  onScrollToCustomizer?: () => void;
}

interface StepItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  actionText?: string;
  actionType?: 'ar' | 'customizer' | 'controls';
  highlights: string[];
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onOpenAR,
  onScrollToCustomizer,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: StepItem[] = [
    {
      id: 'welcome',
      badge: 'مرحباً بك في تجربة V380 Pro',
      title: 'استكشف كاميرا المراقبة 360° التفاعلية',
      subtitle: 'جولة سريعة لاكتشاف إمكانيات النموذج ثلاثي الأبعاد والواقع المعزز',
      description:
        'صممنا لك هذه التجربة التفاعلية لتمكينك من فحص جميع ميزات الكاميرا الذكية V380 Pro، تدوير النموذج 360°، تخصيص الألوان والإضاءة، وتجربتها في مكانك الحقيقي عبر الواقع المعزز (AR).',
      icon: <Sparkles className="w-7 h-7 text-cyan-400" />,
      highlights: [
        'تدوير وتكبير ثلاثي الأبعاد 360° بالسحب واللمس',
        'تخصيص كامل للألوان وهيكل الحماية والإضاءة المحيطية',
        'تجربة فورية في غرفتك أو مزرعتك عبر كاميرا الهاتف (AR)',
      ],
    },
    {
      id: 'customizer',
      badge: 'الخطوة 1: استوديو التخصيص 3D',
      title: 'معاينة هيكل الكاميرا والإضاءة',
      subtitle: 'هيكل رمادي تيتانيوم صناعي مقاوم للظروف المناخية القاسية',
      description:
        'من خلال لوحة التخصيص، يمكنك معاينة هيكل التيتانيوم الرمادي الصناعي المقاوم للشمس والأمطار، وضبط توهج عدسة الحماية ومؤشرات الإنذار، وتجربة إضاءة البيئة (ضوء الشمس، ليل بالأشعة تحت الحمراء، أو كشافات الاستوديو).',
      icon: <Sliders className="w-7 h-7 text-purple-400" />,
      actionText: 'الانتقال لأداة التخصيص',
      actionType: 'customizer',
      highlights: [
        'خامات مقاومة للحرارة والماء معززة بمعيار IP66',
        'توهج ضوئي ذكي للأمان عند اكتشاف الحركة',
        'وضع توفير الطاقة (Eco-Mode) لتسريع الأداء',
      ],
    },
    {
      id: 'ar_mode',
      badge: 'الخطوة 2: وضع الواقع المعزز (AR)',
      title: 'تجربة الكاميرا في غرفتك وموقعك',
      subtitle: 'شاهد أبعاد الكاميرا الحقيقية عبر كاميرا هاتفك أو حاسوبك',
      description:
        'اضغط على زر "العرض في غرفتك (AR)" لفتح كاميرا جهازك ووضع مجسم الكاميرا 3D في مدخل منزلك، جدار المزرعة، أو مكتبك لمعاينة الحجم وزاوية الرؤية بدقة قبل الشراء.',
      icon: <Scan className="w-7 h-7 text-amber-400" />,
      actionText: 'تجربة وضع الواقع المعزز (AR) الآن',
      actionType: 'ar',
      highlights: [
        'مطابقة الأبعاد الحقيقية 1:1 في موقع التثبيت',
        'تحريك، تدوير، ورفع الكاميرا على الجدار الافتراضي',
        'التقاط صور للموقع لمشاركتها مع الفني أو العائلة',
      ],
    },
    {
      id: 'live_ptz',
      badge: 'الخطوة 3: التحكم المباشر والإنذار',
      title: 'لوحة التحكم عن بُعد والدورية 360°',
      subtitle: 'تحكم بالعدسة المتحركة وشاهد البث التجريبي المباشر',
      description:
        'جرب توجيه العدسة السفلية المتحركة (PTZ) للأعلى والأسفل واليمين واليسار، وشغّل الكشافات الليلية البيضاء أو صفارة الإنذار الأمني 110dB مع وميض الشرطة التحذيري.',
      icon: <Compass className="w-7 h-7 text-emerald-400" />,
      highlights: [
        'مسح دوري تلقائي 360° للمحيط (Auto Cruise)',
        'تكبير رقمي وتقريب حتى 10X',
        'نظام إنذار صوتي فوري وتتبع ذكي للأشخاص',
      ],
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    soundFx.playClick();
    if (isLastStep) {
      handleCompleteTour();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleCompleteTour = () => {
    soundFx.playSuccess();
    try {
      localStorage.setItem('v380_onboarding_completed', 'true');
    } catch {
      // Ignore localStorage errors
    }
    onClose();
  };

  const handleStepAction = (type?: string) => {
    soundFx.playClick();
    if (type === 'ar') {
      handleCompleteTour();
      if (onOpenAR) {
        setTimeout(() => {
          onOpenAR();
        }, 150);
      }
    } else if (type === 'customizer') {
      handleCompleteTour();
      if (onScrollToCustomizer) {
        setTimeout(() => {
          onScrollToCustomizer();
        }, 150);
      } else {
        const el = document.getElementById('customizer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-200 text-right">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-5 bg-neutral-950/90 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40">
              {currentStepData.icon}
            </div>
            <div>
              <span className="text-[11px] font-black text-cyan-400 tracking-wider block">
                {currentStepData.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-neutral-100 mt-0.5">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleCompleteTour}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            title="تخطي الجولة التعليمية"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Subtitle & Main Explanation */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-cyan-300">
              {currentStepData.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Highlights Checklist */}
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 space-y-2.5">
            <span className="text-xs font-bold text-neutral-200 block mb-1">
              ✨ أهم الميزات في هذه المرحلة:
            </span>
            {currentStepData.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Quick Action Trigger Button for this step */}
          {currentStepData.actionText && (
            <div className="pt-1">
              <button
                onClick={() => handleStepAction(currentStepData.actionType)}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {currentStepData.actionType === 'ar' ? (
                  <Scan className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <Sliders className="w-4 h-4 text-cyan-400" />
                )}
                <span>{currentStepData.actionText}</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer with Stepper Dots & Navigation Buttons */}
        <div className="p-5 bg-neutral-950/90 border-t border-neutral-800/80 flex items-center justify-between gap-4">
          
          {/* Stepper Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx
                    ? 'w-6 bg-cyan-400'
                    : idx < currentStep
                    ? 'w-2 bg-emerald-500/80'
                    : 'w-2 bg-neutral-700'
                }`}
                title={`الخطوة ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-mono text-neutral-400 mr-2">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex items-center gap-2.5">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-neutral-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              <span>{isLastStep ? 'إنهاء وبدء التجربة 🎉' : 'التالي'}</span>
              {!isLastStep && <ArrowLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
