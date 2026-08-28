import React from 'react';
import { Eye, Sun, Wifi, ShieldAlert, Zap, Sparkles, ArrowLeft, RotateCw, Video, BellRing, Flame } from 'lucide-react';
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
      id: 'dual_optics',
      icon: <Video className="w-6 h-6 text-cyan-400" />,
      tag: 'تقنية العدستين في جهاز واحد',
      title: 'عدسة ثابتة للمدخل + عدسة متحركة 360°',
      description:
        'مراقبة مزدوجة متزامنة: العدسة العلوية الثابتة تراقب البوابة بزاوية واسعة 130° بشكل مستمر، بينما العدسة السفلية تدور 355° أفقياً و 90° رأسياً لتتبع أي شخص يتحرك وتقريب ملامحه بدقة.',
      metric: '360° + 130°',
      metricLabel: 'تغطية مزدوجة كاملة',
      glow: 'hover:border-cyan-500/50 hover:shadow-cyan-950/40',
      action: () => {
        soundFx.playClick();
        onConfigChange({ isExploded: false, cameraPreset: 'front' });
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'fire_alert',
      icon: <Flame className="w-6 h-6 text-amber-400 animate-pulse" />,
      tag: 'مراقبة الممتلكات من النيران والحرائق',
      title: 'كشف اللهب والحرارة مع إنذار فوري وتنبيه الجوال',
      description:
        'نظام حماية حراري وبصري ذكي يرصد الارتفاع المفاجئ في درجات الحرارة وتوهج النيران في محيط المزرعة أو الهنجر أو البيت، ويطلق فوراً صفارة إنذار 110dB مع إرسال إشعار طوارئ وصورة البث المباشر لهاتفك لإنقاذ الممتلكات.',
      metric: 'إنذار فوري 24/7',
      metricLabel: 'حماية الممتلكات من خطر النيران',
      glow: 'hover:border-amber-500/50 hover:shadow-amber-950/40',
      action: () => {
        soundFx.playClick();
        const next = !config.alarmActive;
        onConfigChange({
          alarmActive: next,
          lightingPreset: next ? 'cyber_neon' : 'studio',
        });
        if (next) {
          soundFx.startAlarmSiren();
          soundFx.playVoiceAlert('تحذير طارئ! تم تفعيل نظام كشف النيران ومراقبة الممتلكات');
          setTimeout(() => {
            soundFx.stopAlarmSiren();
          }, 6000);
        } else {
          soundFx.stopAlarmSiren();
        }
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'solar_power',
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      tag: 'شحن ذاتي 100% بدون كهرباء',
      title: 'لوح طاقة شمسية + بطارية ليثيوم 20,000mAh',
      description:
        'شحن مستمر 365 يوماً في السنة بدون انقطاع وبدون تمديد أسلاك كهربائية مكلفة. تعمل بكفاءة عالية حتى في الأيام الماطرة والغائمة بفضل بطارية الليثيوم المدمجة الضخمة.',
      metric: '365 يوماً',
      metricLabel: 'تشغيل ذاتي متواصل',
      glow: 'hover:border-amber-500/50 hover:shadow-amber-950/40',
      action: () => {
        soundFx.playClick();
        onConfigChange({ isExploded: true, explodedProgress: 0.8 });
        const inspectorEl = document.getElementById('inspector');
        if (inspectorEl) inspectorEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'sim_4g',
      icon: <Wifi className="w-6 h-6 text-purple-400" />,
      tag: 'اتصال 4G في أي مكان بدون واي فاي',
      title: 'شريحة بيانات 4G SIM تعمل بجميع الشبكات',
      description:
        'الحل المثالي للمزارع، الاستراحات، المباني تحت الإنشاء، والمخازن البعيدة. فقط ركّب شريحة بيانات 4G وشاهد البث المباشر فوراً على تطبيق V380 Pro من أي مكان في العالم.',
      metric: '4G LTE',
      metricLabel: 'تغطية شاملة لكل الشبكات',
      glow: 'hover:border-purple-500/50 hover:shadow-purple-950/40',
      action: () => {
        soundFx.playClick();
        onConfigChange({ isWireframe: !config.isWireframe });
      },
    },
    {
      id: 'ai_security',
      icon: <BellRing className="w-6 h-6 text-emerald-400" />,
      tag: 'حماية ذكية وردع فوري',
      title: 'إنذار بوليسي، صفارة 110dB ورؤية ليلية ملونة',
      description:
        'مستشعر حركة حراري PIR ذكي يميز الأشخاص فوراً، مع إضاءة كشافات ليلية بيضاء، فلاش إنذار أحمر وأزرق، صفارة تحذيرية، وصوت ثنائي الاتجاه للتحدث والاستماع المباشر.',
      metric: '< 0.8 ثانية',
      metricLabel: 'سرعة وصول الإشعار للجوال',
      glow: 'hover:border-emerald-500/50 hover:shadow-emerald-950/40',
      action: () => {
        soundFx.playClick();
        const next = !config.alarmActive;
        onConfigChange({
          alarmActive: next,
          lightingPreset: next ? 'cyber_neon' : 'studio',
        });
        if (next) {
          soundFx.startAlarmSiren();
          soundFx.playVoiceAlert('تنبيه أمني! تم رصد حركة واشتعال صفارة الإنذار');
          setTimeout(() => {
            soundFx.stopAlarmSiren();
          }, 6000);
        } else {
          soundFx.stopAlarmSiren();
        }
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden bg-neutral-950 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-wider">
              <Zap className="w-4 h-4" />
              <span>تقنيات الأمان والحماية المتطورة</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 tracking-tight">
              أمان شامل بدون أسلاك وبدون فواتير كهرباء
            </h2>
            <p className="text-neutral-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              صُممت كاميرا V380 Pro الذكية لتوفير حماية كاملة للممتلكات في أصعب البيئات الخارجية والأماكن النائية بدون الحاجة لبنية تحتية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>معتمدة بتطبيق V380 Pro الرسمي</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className={`group relative p-7 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 transition-all duration-300 ${item.glow} cursor-pointer backdrop-blur-md flex flex-col justify-between overflow-hidden`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:border-cyan-500/40 transition-colors shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-400 font-mono tracking-wider bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-100 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Metric Footer */}
              <div className="pt-6 mt-6 border-t border-neutral-800/60 flex items-center justify-between relative z-10">
                <div>
                  <div className="text-2xl font-black text-neutral-100 font-mono tracking-tight group-hover:text-cyan-400 transition-colors">
                    {item.metric}
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">
                    {item.metricLabel}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-neutral-900/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 group-hover:border-cyan-500/50 group-hover:-translate-x-1 transition-all">
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
