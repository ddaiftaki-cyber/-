import React, { useState, useEffect, useRef } from 'react';
import { ProductConfig, PricingPlan } from '../types';
import { soundFx } from '../utils/audio';
import {
  Camera,
  Play,
  Pause,
  Sun,
  Shield,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Eye,
  Flashlight,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Video,
  Download,
  Crosshair,
  Wifi,
  BatteryCharging,
  PhoneCall,
  ShoppingBag,
  Sliders,
  Compass,
  Layers,
  CircleDot,
  Leaf,
  ZapOff,
  Flame,
  AlertTriangle,
} from 'lucide-react';

interface LiveCameraStudioProps {
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
}

export const LiveCameraStudio: React.FC<LiveCameraStudioProps> = ({
  config,
  onConfigChange,
  onOpenReservation,
}) => {
  // PTZ State
  const panAngle = config.ptzPanAngle ?? 0;
  const tiltAngle = config.ptzTiltAngle ?? 0;
  const zoomLevel = config.ptzZoom ?? 1.0;
  const isAutoCruise = config.ptzAutoCruise ?? false;
  const isFloodlightOn = config.floodlightActive ?? false;
  const isAlarmOn = config.alarmActive ?? false;
  const nightVision = config.nightVisionMode ?? 'smart_color';

  // Live Screen State
  const [activeViewMode, setActiveViewMode] = useState<'dual' | 'ptz_only' | 'fixed_only' | 'pip'>('dual');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [talkSeconds, setTalkSeconds] = useState(0);
  const [aiTrackingActive, setAiTrackingActive] = useState(false);
  const [aiTargetPos, setAiTargetPos] = useState({ x: 45, y: 55, visible: false });
  const [fireAlertActive, setFireAlertActive] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState('');
  const [snapshotFeedback, setSnapshotFeedback] = useState(false);
  const [voiceSpoken, setVoiceSpoken] = useState(false);

  // Touch Joystick Drag State
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDraggingJoy, setIsDraggingJoy] = useState(false);
  const [joyOffset, setJoyOffset] = useState({ x: 0, y: 0 });

  // Canvas Ref for simulated camera rendering
  const canvasFixedRef = useRef<HTMLCanvasElement>(null);
  const canvasPtzRef = useRef<HTMLCanvasElement>(null);

  // Clock timer
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} GMT+1`;
      setLiveTimestamp(str);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Record timer
  useEffect(() => {
    let int: number;
    if (isRecording) {
      int = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(int);
  }, [isRecording]);

  // Two-way talk timer
  useEffect(() => {
    let int: number;
    if (isTalking) {
      int = window.setInterval(() => {
        setTalkSeconds((s) => s + 1);
      }, 1000);
    } else {
      setTalkSeconds(0);
    }
    return () => clearInterval(int);
  }, [isTalking]);

  // Auto Cruise loop
  useEffect(() => {
    if (!isAutoCruise) return;
    const cruiseInterval = setInterval(() => {
      onConfigChange({
        ptzPanAngle: ((config.ptzPanAngle ?? 0) + 15) % 360,
      });
    }, 400);
    return () => clearInterval(cruiseInterval);
  }, [isAutoCruise, config.ptzPanAngle, onConfigChange]);

  // AI Human Detection & Tracking Simulation
  useEffect(() => {
    if (!aiTrackingActive) {
      setAiTargetPos((p) => ({ ...p, visible: false }));
      return;
    }

    let step = 0;
    const aiInterval = setInterval(() => {
      step += 0.08;
      const targetX = 50 + Math.sin(step) * 35;
      const targetY = 55 + Math.cos(step * 0.7) * 12;
      setAiTargetPos({ x: targetX, y: targetY, visible: true });

      // Pivot PTZ towards target
      const offsetPan = (targetX - 50) * 1.5;
      const offsetTilt = (targetY - 55) * 0.8;
      onConfigChange({
        ptzPanAngle: Math.round(offsetPan),
        ptzTiltAngle: Math.round(offsetTilt),
      });
    }, 120);

    return () => clearInterval(aiInterval);
  }, [aiTrackingActive, onConfigChange]);

  // Handle Manual PTZ Direction Clicks
  const handlePtzMove = (panDelta: number, tiltDelta: number) => {
    soundFx.playClick();
    if (isAutoCruise) {
      onConfigChange({ ptzAutoCruise: false });
    }
    const newPan = Math.max(-170, Math.min(170, (config.ptzPanAngle ?? 0) + panDelta));
    const newTilt = Math.max(-45, Math.min(65, (config.ptzTiltAngle ?? 0) + tiltDelta));
    onConfigChange({
      ptzPanAngle: newPan,
      ptzTiltAngle: newTilt,
    });
  };

  const handleResetCenter = () => {
    soundFx.playClick();
    onConfigChange({
      ptzPanAngle: 0,
      ptzTiltAngle: 0,
      ptzZoom: 1.0,
      ptzAutoCruise: false,
    });
  };

  const handleZoomChange = (delta: number) => {
    soundFx.playClick();
    const newZoom = Math.max(1.0, Math.min(10.0, Number(((config.ptzZoom ?? 1.0) + delta).toFixed(1))));
    onConfigChange({ ptzZoom: newZoom });
  };

  // Toggle Floodlight
  const toggleFloodlight = () => {
    soundFx.playClick();
    const next = !isFloodlightOn;
    onConfigChange({ floodlightActive: next });
    if (next) {
      soundFx.playBeep();
    }
  };

  // Toggle Siren Alarm
  const toggleAlarm = () => {
    soundFx.playClick();
    const next = !isAlarmOn;
    onConfigChange({ alarmActive: next });
    if (next) {
      soundFx.startAlarmSiren();
      soundFx.playVoiceAlert('تنبيه أمني! منطقة مراقبة ذكية، تم تفعيل الإنذار والتسجيل الفوري');
    } else {
      soundFx.stopAlarmSiren();
    }
  };

  // Toggle Two-way Talk
  const handleToggleTalk = () => {
    soundFx.playWalkieTalkieChirp();
    if (!isTalking) {
      setIsTalking(true);
      soundFx.playVoiceAlert('مرحباً، أنا أراك وأتحدث معك مباشرة عبر كاميرا V380 Pro');
    } else {
      setIsTalking(false);
    }
  };

  // Snapshot Capture
  const handleTakeSnapshot = () => {
    soundFx.playCameraShutter();
    setSnapshotFeedback(true);
    setTimeout(() => setSnapshotFeedback(false), 400);

    // Generate downloadable snapshot simulation
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background
      ctx.fillStyle = isFloodlightOn ? '#1a2332' : nightVision === 'infrared' ? '#1c1c1c' : '#0a192f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw HUD text
      ctx.fillStyle = '#00f0ff';
      ctx.font = '24px monospace';
      ctx.fillText(`V380 PRO 4K DUAL LENS SNAPSHOT - ${liveTimestamp}`, 40, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.fillText(`PTZ Position: Pan ${panAngle}° / Tilt ${tiltAngle}° | Zoom: ${zoomLevel}X`, 40, 90);
      ctx.fillText(`Power: Solar 100% | Network: 4G LTE Algerian Carriers | Security: Active`, 40, 130);

      // Stamp
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Download
      const link = document.createElement('a');
      link.download = `V380-Snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Toggle Recording
  const handleToggleRecord = () => {
    soundFx.playClick();
    if (!isRecording) {
      setIsRecording(true);
      soundFx.playBeep();
    } else {
      setIsRecording(false);
      soundFx.playSuccess();
    }
  };

  // Render Canvas Simulation Frames
  useEffect(() => {
    // 1. Draw Fixed Panorama Canvas
    const cf = canvasFixedRef.current;
    if (cf) {
      const ctx = cf.getContext('2d');
      if (ctx) {
        const w = cf.width;
        const h = cf.height;
        ctx.clearRect(0, 0, w, h);

        // Sky & Ambient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        if (isFloodlightOn) {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.6, '#1e293b');
          grad.addColorStop(1, '#334155');
        } else if (nightVision === 'infrared') {
          grad.addColorStop(0, '#0a0a0a');
          grad.addColorStop(0.6, '#1c1c1c');
          grad.addColorStop(1, '#2e2e2e');
        } else {
          grad.addColorStop(0, '#020617');
          grad.addColorStop(0.6, '#0f172a');
          grad.addColorStop(1, '#1e1b4b');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Simulated Farm / Villa Perimeter
        ctx.fillStyle = nightVision === 'infrared' ? '#262626' : '#064e3b';
        ctx.fillRect(0, h * 0.65, w, h * 0.35); // Grass/Yard

        // Security Wall & Gate
        ctx.fillStyle = nightVision === 'infrared' ? '#404040' : '#475569';
        ctx.fillRect(w * 0.1, h * 0.45, w * 0.8, h * 0.2); // Wall
        ctx.fillStyle = nightVision === 'infrared' ? '#525252' : '#334155';
        ctx.fillRect(w * 0.4, h * 0.4, w * 0.2, h * 0.25); // Gate

        // Stars / Night ambiance
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 30; i++) {
          const sx = (i * 97) % w;
          const sy = (i * 43) % (h * 0.4);
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Fixed Wide Horizon Lines
        ctx.strokeStyle = nightVision === 'infrared' ? 'rgba(255,255,255,0.1)' : 'rgba(0,240,255,0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, w - 20, h - 20);
      }
    }

    // 2. Draw PTZ Canvas with Dynamic Pan/Tilt offsets & Zoom
    const cp = canvasPtzRef.current;
    if (cp) {
      const ctx = cp.getContext('2d');
      if (ctx) {
        const w = cp.width;
        const h = cp.height;
        ctx.clearRect(0, 0, w, h);

        ctx.save();

        // Apply Zoom & Pan/Tilt Translation
        ctx.translate(w / 2, h / 2);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(-w / 2, -h / 2);

        const panShiftX = (panAngle / 180) * (w * 0.6);
        const tiltShiftY = (tiltAngle / 90) * (h * 0.4);
        ctx.translate(-panShiftX, tiltShiftY);

        // Background Sky
        const ptzGrad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 1.5);
        if (isFloodlightOn) {
          ptzGrad.addColorStop(0, '#1e293b');
          ptzGrad.addColorStop(0.5, '#334155');
          ptzGrad.addColorStop(1, '#475569');
        } else if (nightVision === 'infrared') {
          ptzGrad.addColorStop(0, '#0a0a0a');
          ptzGrad.addColorStop(0.5, '#171717');
          ptzGrad.addColorStop(1, '#262626');
        } else {
          ptzGrad.addColorStop(0, '#020617');
          ptzGrad.addColorStop(0.5, '#09152e');
          ptzGrad.addColorStop(1, '#0e2b4f');
        }
        ctx.fillStyle = ptzGrad;
        ctx.fillRect(-w, -h, w * 3, h * 3);

        // Ground & Terrain
        ctx.fillStyle = nightVision === 'infrared' ? '#303030' : isFloodlightOn ? '#15803d' : '#064e3b';
        ctx.fillRect(-w, h * 0.58, w * 3, h * 1.5);

        // Driveway / Path
        ctx.fillStyle = nightVision === 'infrared' ? '#454545' : '#334155';
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h * 1.2);
        ctx.lineTo(w * 0.7, h * 1.2);
        ctx.lineTo(w * 0.55, h * 0.58);
        ctx.lineTo(w * 0.45, h * 0.58);
        ctx.fill();

        // Warehouse / Villa Architecture
        ctx.fillStyle = nightVision === 'infrared' ? '#555555' : isFloodlightOn ? '#e2e8f0' : '#475569';
        ctx.fillRect(w * 0.15, h * 0.28, w * 0.35, h * 0.3);

        // Roof
        ctx.fillStyle = nightVision === 'infrared' ? '#3a3a3a' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.28);
        ctx.lineTo(w * 0.325, h * 0.15);
        ctx.lineTo(w * 0.55, h * 0.28);
        ctx.fill();

        // Security Light Glow if Floodlight is ON
        if (isFloodlightOn) {
          const floodGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.6);
          floodGrad.addColorStop(0, 'rgba(255, 255, 220, 0.45)');
          floodGrad.addColorStop(0.5, 'rgba(255, 255, 200, 0.15)');
          floodGrad.addColorStop(1, 'rgba(255, 255, 200, 0)');
          ctx.fillStyle = floodGrad;
          ctx.fillRect(-w, -h, w * 3, h * 3);
        }

        // AI Detected Human Simulation Box
        if (aiTargetPos.visible) {
          const px = (aiTargetPos.x / 100) * w;
          const py = (aiTargetPos.y / 100) * h;

          // Person silhouette
          ctx.fillStyle = isAlarmOn ? '#ef4444' : '#10b981';
          ctx.beginPath();
          ctx.arc(px, py - 35, 10, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.fillRect(px - 10, py - 24, 20, 38); // Body
          ctx.fillRect(px - 9, py + 14, 7, 24); // Left leg
          ctx.fillRect(px + 2, py + 14, 7, 24); // Right leg

          // AI Bounding Box
          ctx.strokeStyle = isAlarmOn ? '#ef4444' : '#10b981';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(px - 22, py - 52, 44, 94);

          // AI Label Tag
          ctx.fillStyle = isAlarmOn ? '#ef4444' : '#10b981';
          ctx.fillRect(px - 22, py - 70, 78, 16);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('HUMAN 98.6%', px - 18, py - 58);
        }

        ctx.restore();
      }
    }
  }, [panAngle, tiltAngle, zoomLevel, isFloodlightOn, nightVision, aiTargetPos, isAlarmOn]);

  return (
    <section id="camera-control" className="py-20 bg-neutral-950 relative overflow-hidden text-right border-t border-neutral-900">
      {/* Subtle Cyan / Blue Cyber Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-black text-cyan-400 tracking-wider shadow-lg">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>نظام التشغيل والمراقبة المباشرة V380 PRO LIVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight">
            تشغيل الكاميرا والتحكم المباشر 360°
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            جرّب الآن تشغيل العدستين المزدوجتين، تدوير الكاميرا في جميع الاتجاهات، التقاط الصور، تفعيل الكشافات، والإنذار الصوتي الفوري مثل تطبيق الهاتف تماماً.
          </p>

          {/* Pricing Highlight Pill in Algerian Dinar */}
          <div className="inline-flex items-center justify-center gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-xl">
            <span className="text-xs text-neutral-400">السعر الرسمي الترويجي:</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-sans">36,000 د.ج</span>
            <span className="text-xs font-bold text-amber-300">(3 ملايين و 600 ألف سنتيم)</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/30">
              توصيل مجاني لـ 58 ولاية
            </span>
          </div>
        </div>

        {/* Master Live Control Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Screen Viewport (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Mode Tabs */}
            <div className="flex items-center justify-between bg-neutral-900/80 p-2 rounded-2xl border border-neutral-800 flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 font-bold px-2">وضع العرض:</span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveViewMode('dual');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeViewMode === 'dual'
                      ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🖥️ شاشة مزدوجة (العدستان)
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveViewMode('ptz_only');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeViewMode === 'ptz_only'
                      ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  🔄 العدسة المتحركة PTZ
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveViewMode('fixed_only');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeViewMode === 'fixed_only'
                      ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  👁️ العدسة الثابتة الواسعة
                </button>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold">LIVE 4K</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">3240 Kbps</span>
              </div>
            </div>

            {/* Simulated Live Viewport Frame */}
            <div className="relative rounded-3xl bg-neutral-950 border-2 border-neutral-800 overflow-hidden shadow-2xl aspect-[16/10] flex flex-col">
              
              {/* Snapshot Flash Feedback */}
              {snapshotFeedback && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
              )}

              {/* Police Alarm Flashing Overlay */}
              {isAlarmOn && (
                <div className="absolute inset-0 pointer-events-none z-30 animate-pulse bg-red-600/20 border-4 border-red-500" />
              )}

              {/* Top HUD Overlay Bar */}
              <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-neutral-950/90 to-transparent z-20 flex items-center justify-between text-xs text-neutral-200 font-mono select-none">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-700/60 text-cyan-300">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>4G LTE (Mobilis/Djezzy/Ooredoo)</span>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    config.ecoMode
                      ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 font-bold'
                      : 'bg-neutral-900/80 border-neutral-700/60 text-amber-300'
                  }`}>
                    {config.ecoMode ? (
                      <>
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span>وضع توفير الطاقة Eco (2.1W فائق التوفير)</span>
                      </>
                    ) : (
                      <>
                        <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                        <span>شحن شمسي 100% (20,000mAh)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {config.ecoMode && (
                    <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-300 text-[10px] font-bold border border-emerald-600/50">
                      ⚡ GPU Throttle 1.0x
                    </span>
                  )}
                  {isRecording && (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-red-600/90 text-white font-bold text-[11px] animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>REC {String(Math.floor(recordSeconds / 60)).padStart(2, '0')}:{String(recordSeconds % 60).padStart(2, '0')}</span>
                    </div>
                  )}
                  <span className="text-[11px] text-neutral-300 bg-neutral-900/80 px-2 py-1 rounded-lg border border-neutral-700/60">
                    {liveTimestamp}
                  </span>
                </div>
              </div>

              {/* Video Feeds Display Container */}
              <div className="flex-1 w-full h-full relative flex">
                
                {/* 1. Fixed Lens Panorama (Top or Left in Dual) */}
                {(activeViewMode === 'dual' || activeViewMode === 'fixed_only') && (
                  <div className={`relative h-full ${activeViewMode === 'dual' ? 'w-1/2 border-l border-neutral-800' : 'w-full'}`}>
                    <canvas
                      ref={canvasFixedRef}
                      width={640}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-neutral-950/80 border border-neutral-700/50 text-[10px] text-cyan-300 font-bold">
                      👁️ العدسة العلوية الثابتة (130° زاوية عريضة)
                    </div>
                  </div>
                )}

                {/* 2. PTZ Rotating Lens (Interactive View) */}
                {(activeViewMode === 'dual' || activeViewMode === 'ptz_only') && (
                  <div className={`relative h-full ${activeViewMode === 'dual' ? 'w-1/2' : 'w-full'}`}>
                    <canvas
                      ref={canvasPtzRef}
                      width={640}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Crosshair Center Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      <Crosshair className="w-10 h-10 text-cyan-400" />
                    </div>

                    {/* Bottom PTZ Angle & Zoom Tag */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-neutral-950/80 border border-neutral-700/50 text-[10px] text-amber-300 font-bold flex items-center gap-2 font-mono">
                      <span>🔄 PTZ: {panAngle}° أفقي / {tiltAngle}° عمودي</span>
                      <span>•</span>
                      <span>Zoom: {zoomLevel}X</span>
                    </div>

                    {/* AI Target Detected Badge */}
                    {aiTrackingActive && (
                      <div className="absolute top-12 left-3 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5 animate-pulse">
                        <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تتبع الحركة التلقائي الذكي نشط (AI Locked)</span>
                      </div>
                    )}

                    {/* Two-Way Talk Overlay Banner */}
                    {isTalking && (
                      <div className="absolute inset-x-4 top-14 p-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-400/80 text-center text-xs font-bold text-cyan-300 shadow-xl animate-bounce">
                        🎙️ جاري التحدث الحي عبر مكبر الكاميرا ({talkSeconds}s)... الصوت مسموع في الموقع!
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Bottom Quick Controls Bar inside Video */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-neutral-950/90 via-neutral-950/60 to-transparent z-20 flex items-center justify-between flex-wrap gap-2 text-xs">
                
                {/* Left Live Quick Actions */}
                <div className="flex items-center gap-2">
                  {/* Snapshot Button */}
                  <button
                    onClick={handleTakeSnapshot}
                    className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-cyan-400 transition-all flex items-center gap-1.5 font-bold shadow-lg"
                    title="التقاط صورة وحفظها"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span className="hidden sm:inline">التقاط صورة</span>
                  </button>

                  {/* Manual Record Button */}
                  <button
                    onClick={handleToggleRecord}
                    className={`p-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      isRecording
                        ? 'bg-red-600 border-red-400 text-white animate-pulse'
                        : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-red-400'
                    }`}
                    title="بدء تسجيل فيديو"
                  >
                    <Video className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-rose-400'}`} />
                    <span className="hidden sm:inline">{isRecording ? 'إيقاف التسجيل' : 'تسجيل فيديو'}</span>
                  </button>

                  {/* Two-Way Talk Intercom Button */}
                  <button
                    onClick={handleToggleTalk}
                    className={`p-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      isTalking
                        ? 'bg-cyan-500 border-cyan-300 text-neutral-950 shadow-cyan-500/40'
                        : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-cyan-400'
                    }`}
                    title="التحدث بالصوت الحي"
                  >
                    <Mic className={`w-4 h-4 ${isTalking ? 'text-neutral-950 animate-pulse' : 'text-cyan-400'}`} />
                    <span className="hidden sm:inline">{isTalking ? 'إنهاء التحدث' : 'تحدث بالصوت'}</span>
                  </button>
                </div>

                {/* Right Night Vision & AI Modes */}
                <div className="flex items-center gap-2">
                  {/* Floodlight Toggle */}
                  <button
                    onClick={toggleFloodlight}
                    className={`p-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      isFloodlightOn
                        ? 'bg-amber-400 border-amber-300 text-neutral-950 shadow-amber-400/30'
                        : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-amber-400'
                    }`}
                    title="تشغيل الكشافات الليلية LED"
                  >
                    <Flashlight className={`w-4 h-4 ${isFloodlightOn ? 'text-neutral-950' : 'text-amber-400'}`} />
                    <span className="hidden sm:inline">{isFloodlightOn ? 'الكشافات شاعلة 💡' : 'كشافات LED'}</span>
                  </button>

                  {/* Eco Mode Toggle Button */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      const next = !config.ecoMode;
                      onConfigChange({
                        ecoMode: next,
                        performanceMode: next ? 'eco' : 'balanced',
                      });
                      if (next) soundFx.playBeep();
                    }}
                    className={`p-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      config.ecoMode
                        ? 'bg-emerald-950 border-emerald-500/80 text-emerald-300 ring-2 ring-emerald-500/30'
                        : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-emerald-500/50'
                    }`}
                    title="تفعيل / إيقاف وضع توفير الطاقة للكاميرا والواجهة"
                  >
                    <Leaf className={`w-4 h-4 ${config.ecoMode ? 'text-emerald-400' : 'text-neutral-400'}`} />
                    <span className="hidden sm:inline">{config.ecoMode ? 'Eco نشط 🌱' : 'وضع Eco'}</span>
                  </button>

                  {/* Police Siren Alarm Toggle */}
                  <button
                    onClick={toggleAlarm}
                    className={`p-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      isAlarmOn
                        ? 'bg-red-600 border-red-400 text-white animate-bounce shadow-red-600/40'
                        : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-red-400'
                    }`}
                    title="تفعيل صفارة الإنذار والفلاش الأمني"
                  >
                    <ShieldAlert className={`w-4 h-4 ${isAlarmOn ? 'text-white' : 'text-red-400'}`} />
                    <span className="hidden sm:inline">{isAlarmOn ? 'إيقاف الإنذار 🚨' : 'إنذار أمني'}</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Quick Feature Helper Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">طاقة شمسية دائمة</div>
                  <div className="text-[11px] text-neutral-400">شحن ذاتي بدون كوابل</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <Radio className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">شريحة 4G الجزائر</div>
                  <div className="text-[11px] text-neutral-400">Mobilis, Djezzy, Ooredoo</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-neutral-100">ضمان سنتين معتمد</div>
                  <div className="text-[11px] text-neutral-400">توصيل مجاني لـ 58 ولاية</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive PTZ Remote Controller & Setup (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PTZ Directional Joypad Card */}
            <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-extrabold text-neutral-100">لوحة تدوير العدسة 360° (PTZ)</h3>
                </div>
                <button
                  onClick={handleResetCenter}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 border border-neutral-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>توسيط (0°)</span>
                </button>
              </div>

              {/* Circular D-Pad Controller */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-48 h-48 rounded-full bg-neutral-950 border-2 border-neutral-800 shadow-inner flex items-center justify-center">
                  
                  {/* Up Button */}
                  <button
                    onClick={() => handlePtzMove(0, -15)}
                    className="absolute top-2 w-12 h-10 rounded-t-full bg-neutral-800/90 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 transition-all flex items-center justify-center active:scale-95 shadow-md"
                    title="إمالة للأعلى"
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>

                  {/* Down Button */}
                  <button
                    onClick={() => handlePtzMove(0, 15)}
                    className="absolute bottom-2 w-12 h-10 rounded-b-full bg-neutral-800/90 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 transition-all flex items-center justify-center active:scale-95 shadow-md"
                    title="إمالة للأسفل"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>

                  {/* Left Button (Pan Right in RTL / Screen left) */}
                  <button
                    onClick={() => handlePtzMove(-20, 0)}
                    className="absolute left-2 w-10 h-12 rounded-l-full bg-neutral-800/90 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 transition-all flex items-center justify-center active:scale-95 shadow-md"
                    title="تدوير لليسار"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Right Button */}
                  <button
                    onClick={() => handlePtzMove(20, 0)}
                    className="absolute right-2 w-10 h-12 rounded-r-full bg-neutral-800/90 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 transition-all flex items-center justify-center active:scale-95 shadow-md"
                    title="تدوير لليمين"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Center OK / Reset Hub */}
                  <button
                    onClick={handleResetCenter}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-950 to-neutral-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex flex-col items-center justify-center text-[10px] font-bold shadow-lg active:scale-90"
                  >
                    <Crosshair className="w-5 h-5 text-cyan-400" />
                    <span>توسيط</span>
                  </button>

                </div>

                {/* Live Angle Readout */}
                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-3">
                  <span>الأفقي (Pan): <strong className="text-cyan-400">{panAngle}°</strong></span>
                  <span>•</span>
                  <span>العمودي (Tilt): <strong className="text-amber-400">{tiltAngle}°</strong></span>
                </div>
              </div>

              {/* 360° Auto Cruise Patrol Button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onConfigChange({ ptzAutoCruise: !isAutoCruise });
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 border shadow-lg ${
                  isAutoCruise
                    ? 'bg-amber-400 border-amber-300 text-neutral-950 shadow-amber-400/25 animate-pulse'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700 hover:border-cyan-400'
                }`}
              >
                <CircleDot className={`w-4 h-4 ${isAutoCruise ? 'animate-spin' : 'text-cyan-400'}`} />
                <span>{isAutoCruise ? 'إيقاف المسح التلقائي 360°' : 'تشغيل المسح البانورامي التلقائي 360°'}</span>
              </button>

              {/* Zoom In / Zoom Out Controls */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">التكبير والتقريب الرقمي (Zoom):</span>
                  <span className="font-mono font-bold text-amber-400">{zoomLevel}X</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleZoomChange(-0.5)}
                    disabled={zoomLevel <= 1.0}
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 border border-neutral-700 transition-colors"
                    title="تصغير"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => {
                      onConfigChange({ ptzZoom: parseFloat(e.target.value) });
                    }}
                    className="flex-1 accent-cyan-400 h-2 bg-neutral-950 rounded-lg cursor-pointer"
                  />

                  <button
                    onClick={() => handleZoomChange(0.5)}
                    disabled={zoomLevel >= 10.0}
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 border border-neutral-700 transition-colors"
                    title="تكبير"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Smart Night Vision & AI Tracking Toggles */}
            <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
              
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-neutral-100">أنظمة الرؤية الليلية والتتبع الذكي</h3>
              </div>

              {/* Night Vision 3 Modes */}
              <div className="space-y-2">
                <label className="block text-xs text-neutral-400 font-bold">نمط التصوير الليلي:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onConfigChange({ nightVisionMode: 'smart_color' });
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      nightVision === 'smart_color'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    🌙 ألوان ذكية (Smart)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onConfigChange({ nightVisionMode: 'infrared' });
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      nightVision === 'infrared'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    👁️ أشعة IR خفية
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onConfigChange({ nightVisionMode: 'full_color', floodlightActive: true });
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      nightVision === 'full_color'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    💡 ألوان بالكشافات
                  </button>
                </div>
              </div>

              {/* AI Auto-Human Tracking Simulation Toggle */}
              <div className="pt-3 border-t border-neutral-800">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    const next = !aiTrackingActive;
                    setAiTrackingActive(next);
                    if (next) {
                      soundFx.playVoiceAlert('تم رصد شخص متحرك، جاري القفل والتتبع التلقائي');
                    }
                  }}
                  className={`w-full p-3.5 rounded-2xl border font-black text-xs transition-all flex items-center justify-between shadow-lg ${
                    aiTrackingActive
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-emerald-950/50'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Crosshair className={`w-4 h-4 ${aiTrackingActive ? 'text-emerald-400 animate-spin' : 'text-neutral-400'}`} />
                    <div className="text-right">
                      <div className="font-bold">محاكاة استشعار وتتبع الحركة بالذكاء الاصطناعي</div>
                      <div className="text-[11px] text-neutral-400">AI Human Detection & Tracking</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${aiTrackingActive ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                    {aiTrackingActive ? 'شغال ✅' : 'تشغيل'}
                  </span>
                </button>
              </div>

            </div>

            {/* Direct Pre-Order Call to Action in Algeria */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-cyan-950/60 border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-neutral-400">سعر الباقة الترويجية الكاملة:</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-sans">
                    36,000 د.ج
                  </div>
                  <div className="text-xs text-amber-300 font-bold">
                    (3 ملايين و 600 ألف سنتيم)
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800/60 block">
                    توصيل مجاني 58 ولاية
                  </span>
                  <span className="text-[11px] text-cyan-300 font-bold block pt-1">
                    ضمان ذهبي معتمد سنتين
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenReservation();
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-neutral-950 font-extrabold text-xs shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب الكاميرا الآن (الدفع عند الاستلام)</span>
                </button>

                <a
                  href="tel:0652058044"
                  onClick={() => soundFx.playClick()}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>0652058044</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
