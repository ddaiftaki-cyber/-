import React from 'react';
import {
  Crown,
  Trees,
  Droplets,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Award,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ProductConfig } from '../types';

interface SpatialFeatureMatrixProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
}

export const SpatialFeatureMatrix: React.FC<SpatialFeatureMatrixProps> = ({
  config,
  onConfigChange,
}) => {
  const features = [
    {
      id: 'hardwood_frame',
      icon: <Trees className="w-6 h-6 text-amber-400" />,
      tag: 'هيكل متين يدوم أجيالاً',
      title: 'خشب الزان الأحمر الأوروبي المعالج حرارياً',
      description:
        'نستخدم أصلب أنواع خشب الزan المستورد والمجفف بالبخار لدرجة رطوبة أقل من 8%، لضمان عدم حدوث أي انحناء أو تشقق ومقاومة كاملة لحرارة ورطوبة مناخ المملكة.',
      metric: '1,400 Janka',
      metricLabel: 'مقياس الصلابة الفائقة',
      glow: 'hover:border-amber-400/50 hover:shadow-amber-950/40',
      action: () => {
        soundFx.playClick();
        onConfigChange({ isExploded: true, explodedProgress: 0.5 });
        const inspectorEl = document.getElementById('inspector');
        if (inspectorEl) inspectorEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nano_fabrics',
      icon: <Droplets className="w-6 h-6 text-yellow-400" />,
      tag: 'أقمشة ذكية ضد البقع والسوائل',
      title: 'تقنية النانو الإيطالية طاردة القهوة والعصير',
      description:
        'أنسجة كتان ومخمل بوكليه معالجة بجزيئات النانو؛ تسقط السوائل والقهوة العربية على السطح على شكل قطرات متدحرجة (Lotus Effect) تُمسح بسهولة دون ترك أي أثر.',
      metric: '100,000+',
      metricLabel: 'دورة اختبار احتكاك Martindale',
      glow: 'hover:border-yellow-400/50 hover:shadow-yellow-950/40',
      action: () => {
        soundFx.playFabricSwatch();
        const customizerEl = document.getElementById('customizer');
        if (customizerEl) customizerEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'hr_foam',
      icon: <Layers className="w-6 h-6 text-amber-300" />,
      tag: 'راحة فندقية لا تهبط أبداً',
      title: 'اسفنج طبي عالي الكثافة 45D + نوابض جيبية',
      description:
        'مزيج هندسي بين النوابض الجيبية المعزولة وطبقات الميموري فوم الطبي مع ريش النعام الصناعي ليمنحك احتضاناً مثالياً لفقرات الظهر ودعماً مستمراً حتى مع الجلوس الطويل.',
      metric: '45 كجم/م³',
      metricLabel: 'كثافة الاسفنج الطبي HR Foam',
      glow: 'hover:border-amber-400/50 hover:shadow-amber-950/40',
      action: () => {
        soundFx.playClick();
        onConfigChange({ isExploded: false });
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'saudi_delivery',
      icon: <Truck className="w-6 h-6 text-emerald-400" />,
      tag: 'خدمة ديموس المميزة بالمملكة',
      title: 'توصيل وتركيب فندقي مجاني لجميع مناطق السعودية',
      description:
        'فريق فني سعودي متخصص يقوم بنقل المفروشات بسيارات مجهزة مسبقاً وتفريغها وتركيبها في مجلسك أو صالتك مع التنظيف الكامل والتأكد من رضاك التام.',
      metric: '100% مجاناً',
      metricLabel: 'شامل التوصيل والتركيب والتغليف',
      glow: 'hover:border-emerald-400/50 hover:shadow-emerald-950/40',
      action: () => {
        soundFx.playClick();
        const pricingEl = document.getElementById('pricing');
        if (pricingEl) pricingEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden bg-neutral-950 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400 tracking-wider">
              <Crown className="w-4 h-4" />
              <span>معايير الفخامة والحرفية اليدوية الإيطالية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
              أثاث صُمم ليبقى، ويتألق في قلب بيتك
            </h2>
            <p className="text-neutral-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              كل قطعة من مفروشات ديموس تخضع لأكثر من 42 فحص جودة واختبار متانة لضمان أعلى مستويات الراحة والأناقة لمجالس وصالونات المملكة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-black text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>ضمان ذهبي 10 سنوات شامل</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className={`group relative p-7 rounded-3xl bg-neutral-900/50 border border-neutral-800 transition-all duration-300 ${item.glow} cursor-pointer backdrop-blur-md flex flex-col justify-between overflow-hidden hover:scale-[1.01]`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/40 transition-colors shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-black text-amber-300 font-sans tracking-wider bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Metric Footer */}
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between relative z-10">
                <div>
                  <div className="text-2xl font-black text-neutral-100 font-mono tracking-tight group-hover:text-amber-400 transition-colors">
                    {item.metric}
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">
                    {item.metricLabel}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 group-hover:border-amber-500/50 group-hover:-translate-x-1 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
