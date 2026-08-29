import React, { useState, useEffect, useRef } from 'react';
import { ProductConfig, PricingPlan } from '../types';
import { soundFx } from '../utils/audio';
import { DimossLogo } from './DimossLogo';
import {
  Sparkles,
  Sun,
  Shield,
  ShieldCheck,
  Eye,
  RotateCcw,
  Zap,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ShoppingBag,
  Sliders,
  Compass,
  Layers,
  CircleDot,
  Leaf,
  ZapOff,
  Crown,
  Maximize2,
  Palette,
  Lightbulb,
  Moon,
  Home,
  Clock,
  Activity,
  Gauge,
  BatteryCharging,
  TrendingDown,
  Power,
  Play,
  Pause,
} from 'lucide-react';

interface LiveShowroomStudioProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
}

export const LiveShowroomStudio: React.FC<LiveShowroomStudioProps> = ({
  config,
  onConfigChange,
  onOpenReservation,
}) => {
  // Lighting & Room Preset State
  const [roomPreset, setRoomPreset] = useState<'luxury_majlis' | 'modern_salon' | 'penthouse_sunset' | 'night_lounge'>('luxury_majlis');
  const [ambientIntensity, setAmbientIntensity] = useState(85);
  const [spotlightAngle, setSpotlightAngle] = useState(45);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  
  // Power Saving / Eco Dashboard State
  const [sleepModeActive, setSleepModeActive] = useState(false);
  const [idleTimeSeconds, setIdleTimeSeconds] = useState(0);
  const [energySavedKwh, setEnergySavedKwh] = useState(3.42);
  const [carbonOffsetKg, setCarbonOffsetKg] = useState(1.85);
  const [wattReduction, setWattReduction] = useState(78); // 78% energy saved
  const [activeRuntimeHours, setActiveRuntimeHours] = useState(142);

  // Canvas Ref for simulated interactive luxury room viewport
  const canvasRoomRef = useRef<HTMLCanvasElement>(null);

  // Auto-Sleep & Idle Detection Timer
  useEffect(() => {
    const idleTimer = setInterval(() => {
      setIdleTimeSeconds((prev) => {
        if (config.ecoMode && prev > 15 && !sleepModeActive) {
          setSleepModeActive(true);
        }
        return prev + 1;
      });

      if (config.ecoMode) {
        setEnergySavedKwh((k) => +(k + 0.0004).toFixed(4));
        setCarbonOffsetKg((c) => +(c + 0.0002).toFixed(4));
      }
    }, 1000);

    const resetIdle = () => {
      setIdleTimeSeconds(0);
      if (sleepModeActive) {
        setSleepModeActive(false);
      }
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    return () => {
      clearInterval(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
    };
  }, [config.ecoMode, sleepModeActive]);

  // Auto 360 Tour
  useEffect(() => {
    if (!isAutoTour) return;
    const tourInterval = setInterval(() => {
      setSpotlightAngle((prev) => (prev + 3) % 360);
    }, 100);
    return () => clearInterval(tourInterval);
  }, [isAutoTour]);

  // Snapshot generator
  const handleTakeSnapshot = () => {
    soundFx.playCameraShutter();
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 500);

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 28px Cairo, sans-serif';
      ctx.fillText('DIMOSS LUXURY SOFA & MAJLIS - 3D STUDIO DESIGN', 50, 60);

      ctx.fillStyle = '#e7e5e4';
      ctx.font = '20px Cairo, sans-serif';
      ctx.fillText(`القماش: ${config.material.name} | الخشب: ${config.woodFinish} | المعدن: ${config.metalAccent}`, 50, 110);
      ctx.fillText(`الضمان: 10 سنوات ذهبي شامل | التوصيل: كافة مدن المملكة 🇸🇦`, 50, 150);

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      const link = document.createElement('a');
      link.download = `تصميم-مفروشات-ديموس-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Render 2D Canvas Architectural Preview
  useEffect(() => {
    const canvas = canvasRoomRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background Room Gradient based on Preset
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (roomPreset === 'luxury_majlis') {
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(0.6, '#292524');
      bgGrad.addColorStop(1, '#0c0a09');
    } else if (roomPreset === 'modern_salon') {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
    } else if (roomPreset === 'penthouse_sunset') {
      bgGrad.addColorStop(0, '#451a03');
      bgGrad.addColorStop(0.6, '#78350f');
      bgGrad.addColorStop(1, '#1c1917');
    } else {
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.6, '#18181b');
      bgGrad.addColorStop(1, '#000000');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Wall Panels & Crown Molding
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 2;
    for (let x = 60; x < w; x += 140) {
      ctx.strokeRect(x, 40, 100, h * 0.45);
    }

    // Floor Base with Marble / Hardwood sheen
    const floorGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
    floorGrad.addColorStop(0, '#292524');
    floorGrad.addColorStop(1, '#141210');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);

    // Luxury Carpet
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.78, w * 0.42, h * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spotlight Cone from Top
    const spotX = w * 0.5 + Math.sin((spotlightAngle * Math.PI) / 180) * 120;
    const spotGrad = ctx.createRadialGradient(spotX, h * 0.65, 30, spotX, h * 0.65, 260);
    spotGrad.addColorStop(0, `rgba(254, 240, 138, ${ambientIntensity / 250})`);
    spotGrad.addColorStop(0.7, `rgba(212, 175, 55, ${ambientIntensity / 500})`);
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, w, h);

    // Render Sofa Silhouette in Room
    const sofaColor = config.material.color || '#d4af37';
    ctx.fillStyle = sofaColor;
    // Main Seat
    ctx.beginPath();
    ctx.roundRect(w * 0.24, h * 0.62, w * 0.52, h * 0.18, [18, 18, 8, 8]);
    ctx.fill();

    // Backrest Cushions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.roundRect(w * 0.26, h * 0.50, w * 0.23, h * 0.14, 12);
    ctx.roundRect(w * 0.51, h * 0.50, w * 0.23, h * 0.14, 12);
    ctx.fill();

    // Wood Base Plinth
    ctx.fillStyle = config.woodFinish === 'natural_oak' ? '#b45309' : config.woodFinish === 'ebony_black' ? '#1c1917' : '#78350f';
    ctx.roundRect(w * 0.22, h * 0.79, w * 0.56, 14, 4);
    ctx.fill();

    // Metal Legs Gold
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(w * 0.23, h * 0.81, 10, 20);
    ctx.fillRect(w * 0.75, h * 0.81, 10, 20);

    // Sleep Mode Dimming & Eco Overlay
    if (sleepModeActive || config.ecoMode) {
      ctx.fillStyle = sleepModeActive ? 'rgba(0, 0, 0, 0.65)' : 'rgba(6, 78, 59, 0.18)';
      ctx.fillRect(0, 0, w, h);

      if (sleepModeActive) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 16px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💤 وضع السكون التلقائي لتوفير الطاقة نشط', w / 2, h / 2 - 10);
        ctx.font = '12px Cairo, sans-serif';
        ctx.fillStyle = '#a7f3d0';
        ctx.fillText('حرك الفأرة أو المس الشاشة للاستئناف الفوري', w / 2, h / 2 + 20);
        ctx.textAlign = 'right';
      }
    }
  }, [roomPreset, ambientIntensity, spotlightAngle, config.material, config.woodFinish, config.ecoMode, sleepModeActive]);

  return (
    <section id="room-studio" className="py-20 bg-neutral-950 relative overflow-hidden text-right border-t border-neutral-900">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-1 rounded-xl bg-white/95 border border-neutral-200 shadow-md">
              <DimossLogo variant="full" size="sm" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-xs font-black text-red-300 tracking-wider shadow-lg">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>استوديو الصالونات والمجالس الملكية • DIMOSS STUDIO</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
            محاكي الإضاءة وتنسيق الغرف 360°
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            اختبر ألوان الكنب والأقمشة تحت درجات إضاءة المجالس المختلفة (نهاري، غروب، صالون ملكي، إضاءة ليلية هادئة) مع لوحة التحكم الذكية بكفاءة الطاقة والأداء.
          </p>

          {/* Pricing Highlight Pill in Saudi Riyals */}
          <div className="inline-flex items-center justify-center gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-xl flex-wrap">
            <span className="text-xs text-neutral-400">طقم المجلس الملكي المتكامل:</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-sans">8,900 ر.س</span>
            <span className="text-xs font-bold text-amber-300">أو 2,225 ر.س / شهر (تابي وتمارا 0%)</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/30">
              توصيل وتركيب مجاني 🇸🇦
            </span>
          </div>
        </div>

        {/* Master Live Control Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Showroom Viewport (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Room Mood Environment Selector */}
            <div className="flex items-center justify-between bg-neutral-900/80 p-2 rounded-2xl border border-neutral-800 flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-neutral-400 font-bold px-2">أجواء الصالة:</span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setRoomPreset('luxury_majlis');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    roomPreset === 'luxury_majlis'
                      ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  👑 مجلس ملكي فاخر
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setRoomPreset('modern_salon');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    roomPreset === 'modern_salon'
                      ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🏛️ صالون مودرن
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setRoomPreset('penthouse_sunset');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    roomPreset === 'penthouse_sunset'
                      ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🌇 إضاءة الغروب الذهبي
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 font-bold">4K HDR</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">60 FPS</span>
              </div>
            </div>

            {/* Simulated Live Viewport Frame */}
            <div className="relative rounded-3xl bg-neutral-950 border-2 border-neutral-800 overflow-hidden shadow-2xl aspect-[16/10] flex flex-col">
              
              {/* Snapshot Flash Feedback */}
              {snapshotTaken && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
              )}

              {/* Top HUD Overlay Bar */}
              <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-neutral-950/90 to-transparent z-20 flex items-center justify-between text-xs text-neutral-200 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-700/60 text-amber-300">
                    <Home className="w-3.5 h-3.5 text-amber-400" />
                    <span>مجموعة السيادة الملكية • DIMOSS KSA</span>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    config.ecoMode
                      ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 font-bold'
                      : 'bg-neutral-900/80 border-neutral-700/60 text-amber-300'
                  }`}>
                    {config.ecoMode ? (
                      <>
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span>وضع توفير الطاقة الذكي (وفرت {wattReduction}%)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>الرندر الفائق (Ultra Ray-Tracing)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTakeSnapshot}
                    className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-amber-300 flex items-center gap-1 text-[11px] font-bold"
                    title="حفظ لقطة من التصميم"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>حفظ لقطة</span>
                  </button>
                </div>
              </div>

              {/* Canvas Render Area */}
              <div className="flex-1 w-full h-full relative flex">
                <canvas
                  ref={canvasRoomRef}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Quick Controls inside Video Frame */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-neutral-950/90 via-neutral-950/60 to-transparent z-20 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsAutoTour(!isAutoTour);
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                      isAutoTour
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md shadow-amber-400/20'
                        : 'bg-neutral-900/90 text-neutral-200 border-neutral-700 hover:border-amber-400'
                    }`}
                  >
                    {isAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isAutoTour ? 'إيقاف الجولة 360°' : 'جولة إضاءة تلقائية'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      const next = !config.ecoMode;
                      onConfigChange({ ecoMode: next, performanceMode: next ? 'eco' : 'balanced' });
                      if (next) soundFx.playSuccess();
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                      config.ecoMode
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-neutral-900/90 text-neutral-300 border-neutral-700 hover:border-emerald-500/50'
                    }`}
                  >
                    <Leaf className={`w-3.5 h-3.5 ${config.ecoMode ? 'text-emerald-400' : 'text-neutral-400'}`} />
                    <span>{config.ecoMode ? 'Eco نشط 🌱' : 'توفير الطاقة Eco'}</span>
                  </button>
                </div>

                <div className="text-neutral-400 text-[11px] font-mono">
                  القماش: <strong className="text-amber-300">{config.material.name}</strong>
                </div>
              </div>

            </div>

            {/* Helper Specs Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">خشب زان أحمر طبيعي</div>
                  <div className="text-[11px] text-neutral-400">هيكل متين مجفف 100%</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">ضمان 10 سنوات شامل</div>
                  <div className="text-[11px] text-neutral-400">على الهيكل والاسفنج والنوابض</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">أقمشة نانو مقاومة للبقع</div>
                  <div className="text-[11px] text-neutral-400">سهلة التنظيف بمسحة واحدة</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Lighting Controls & Power Saving Eco Dashboard (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Lighting Studio Sliders Card */}
            <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-neutral-100">التحكم في إضاءة الصالة</h3>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setAmbientIntensity(85);
                    setSpotlightAngle(45);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 border border-neutral-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>إعادة ضبط</span>
                </button>
              </div>

              {/* Ambient Intensity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-bold">شدة الإضاءة المحيطة:</span>
                  <span className="font-mono text-amber-400 font-bold">{ambientIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={ambientIntensity}
                  onChange={(e) => setAmbientIntensity(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-neutral-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Spotlight Angle Direction Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-bold">زاوية تسليط الضوء الدائري:</span>
                  <span className="font-mono text-amber-400 font-bold">{spotlightAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={spotlightAngle}
                  onChange={(e) => setSpotlightAngle(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-neutral-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Outstanding Request: Mini Dashboard for Power Saving Mode (لوحة بيانات وضع توفير الطاقة ومقدار الطاقة الموفرة) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-100">لوحة بيانات كفاءة وتوفير الطاقة</h3>
                    <p className="text-[11px] text-emerald-400 font-bold">Eco-Mode & Smart Sleep Analytics</p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                  config.ecoMode
                    ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {config.ecoMode ? 'نشط ومفعّل' : 'توفير قياسي'}
                </div>
              </div>

              {/* 4 Stats Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {/* 1. Wattage Saving Rate */}
                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>نسبة خفض الاستهلاك</span>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono">{wattReduction}%</div>
                  <div className="text-[10px] text-neutral-500">انخفاض من 48W إلى 10.5W</div>
                </div>

                {/* 2. Total Energy Saved (kWh) */}
                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>إجمالي الطاقة الموفرة</span>
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono">{energySavedKwh} kWh</div>
                  <div className="text-[10px] text-neutral-500">بفضل السكون وإدارة الرندر</div>
                </div>

                {/* 3. Carbon Emissions Avoided */}
                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>انبعاثات تم تفاديها</span>
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-emerald-300 font-mono">{carbonOffsetKg} kg CO₂</div>
                  <div className="text-[10px] text-neutral-500">مبادرة الاستدامة الخضراء</div>
                </div>

                {/* 4. Auto Sleep Timer Status */}
                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>وضع السكون التلقائي</span>
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-base font-black text-neutral-100 font-mono">
                    {sleepModeActive ? 'سكون نشط 💤' : `${Math.max(0, 15 - idleTimeSeconds)}s للتحويل`}
                  </div>
                  <div className="text-[10px] text-neutral-500">سكون تلقائي بعد 15 ثانية خمول</div>
                </div>

              </div>

              {/* Eco Mode Features Breakdown Checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-neutral-300 block">الميزات التلقائية المفعلة لتوفير الطاقة:</span>
                <div className="space-y-1.5 text-neutral-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>تحويل محرك الرندر إلى وضع السكون الفوري عند توقف حركة المستخدم.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>تقليل تردد تحديث الإطارات (GPU Dynamic Throttling) لتقليل حرارة المعالج.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>ضبط الإضاءة المحيطة تلقائياً لتخفيف سطوع الشاشة واستهلاك البطارية.</span>
                  </div>
                </div>
              </div>

              {/* Direct Order CTA button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenReservation();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-neutral-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>حجز طقم كنب ديموس الملكي مع تقسيط تابي وتمارا</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
