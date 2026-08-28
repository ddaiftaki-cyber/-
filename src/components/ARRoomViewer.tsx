import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ProductConfig } from '../types';
import { MATERIAL_PRESETS } from '../data/productData';
import { buildCamera3DModel, Camera3DModelInstance } from '../utils/cameraModelBuilder';
import { soundFx } from '../utils/audio';
import {
  Camera,
  X,
  RotateCw,
  Sun,
  ShieldAlert,
  Zap,
  Maximize,
  Minimize,
  Sliders,
  Sparkles,
  Download,
  Share2,
  Check,
  RefreshCw,
  Layers,
  HelpCircle,
  Volume2,
  VolumeX,
  Video,
  Move,
  Scan,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  ShoppingBag,
} from 'lucide-react';

interface ARRoomViewerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
}

export const ARRoomViewer: React.FC<ARRoomViewerProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
  onOpenReservation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ThreeJS AR Engine references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelInstanceRef = useRef<Camera3DModelInstance | null>(null);
  const arRootGroupRef = useRef<THREE.Group | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);
  const reticleGroupRef = useRef<THREE.Group | null>(null);
  const requestAnimFrameRef = useRef<number>(0);

  // AR Camera stream & state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [webXRSupported, setWebXRSupported] = useState(false);
  const [isWebXRSessionActive, setIsWebXRSessionActive] = useState(false);

  // AR Controls State
  const [placementMode, setPlacementMode] = useState<'wall' | 'desk' | 'gate'>('wall');
  const [scaleFactor, setScaleFactor] = useState<number>(1.0); // 1.0 = real-world ~28cm
  const [rotationY, setRotationY] = useState<number>(0);
  const [elevationY, setElevationY] = useState<number>(0);
  const [isLockedPlacement, setIsLockedPlacement] = useState(false);
  const [ptzPan, setPtzPan] = useState(0);
  const [ptzTilt, setPtzTilt] = useState(0);
  const [arAlarmActive, setArAlarmActive] = useState(false);
  const [arFloodlightActive, setArFloodlightActive] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'presets' | 'ptz'>('controls');

  // Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; dist: number; angle: number }>({
    x: 0,
    y: 0,
    dist: 0,
    angle: 0,
  });
  const modelPosRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0.1, z: -2.8 });

  // Check WebXR Device API availability
  useEffect(() => {
    if ('xr' in navigator && (navigator as any).xr) {
      (navigator as any).xr
        .isSessionSupported('immersive-ar')
        .then((supported: boolean) => setWebXRSupported(supported))
        .catch(() => setWebXRSupported(false));
    }
  }, []);

  // Initialize and manage camera stream
  const startCameraStream = useCallback(async (mode: 'environment' | 'user') => {
    setCameraError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access fallback:', err);
      setCameraError(
        'تعذر الوصول المباشر لكاميرا جهازك. تم تفعيل المحاكاة ثلاثية الأبعاد ثلاثية المحاور للغرفة.'
      );
      setCameraActive(false);
    }
  }, []);

  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Switch camera between back & front
  const toggleCameraFacing = () => {
    soundFx.playClick();
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCameraStream(nextMode);
  };

  // Launch Native WebXR Session if supported
  const launchNativeWebXR = async () => {
    soundFx.playClick();
    if (!webXRSupported || !rendererRef.current) return;
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
        optionalFeatures: ['dom-overlay', 'light-estimation'],
        domOverlay: { root: containerRef.current },
      });
      setIsWebXRSessionActive(true);
      rendererRef.current.xr.enabled = true;
      await rendererRef.current.xr.setSession(session);

      session.addEventListener('end', () => {
        setIsWebXRSessionActive(false);
      });
    } catch (err) {
      console.warn('WebXR session error:', err);
    }
  };

  // Initialize ThreeJS AR Canvas
  useEffect(() => {
    if (!isOpen) return;

    // Start user video
    startCameraStream(facingMode);

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.05, 50);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer with Alpha transparent background for video pass-through
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // AR Root Object (holds the camera model, shadow, and position offset)
    const arRoot = new THREE.Group();
    arRoot.position.set(modelPosRef.current.x, modelPosRef.current.y, modelPosRef.current.z);
    scene.add(arRoot);
    arRootGroupRef.current = arRoot;

    // Lighting (Environment light simulator matching realistic room daylight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keySunLight = new THREE.DirectionalLight(0xfff8e7, 2.2);
    keySunLight.position.set(2, 6, 4);
    keySunLight.castShadow = true;
    keySunLight.shadow.mapSize.width = 1024;
    keySunLight.shadow.mapSize.height = 1024;
    scene.add(keySunLight);

    const fillRoomLight = new THREE.DirectionalLight(0x90caf9, 1.0);
    fillRoomLight.position.set(-3, -2, 2);
    scene.add(fillRoomLight);

    // Realistic Floor Shadow Receiver Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: 0.45,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.4;
    shadowPlane.receiveShadow = true;
    arRoot.add(shadowPlane);
    shadowPlaneRef.current = shadowPlane;

    // Placement Reticle Circle (Target indicator on the room plane)
    const reticleGroup = new THREE.Group();
    const reticleRingGeo = new THREE.RingGeometry(0.7, 0.76, 48);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const reticleMesh = new THREE.Mesh(reticleRingGeo, reticleMat);
    reticleMesh.rotation.x = -Math.PI / 2;
    reticleMesh.position.y = -1.39;
    reticleGroup.add(reticleMesh);

    // Inner pulsating dot
    const centerDotGeo = new THREE.CircleGeometry(0.12, 32);
    const centerDotMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
    centerDot.rotation.x = -Math.PI / 2;
    centerDot.position.y = -1.38;
    reticleGroup.add(centerDot);

    arRoot.add(reticleGroup);
    reticleGroupRef.current = reticleGroup;

    // Build the 3D Camera Model
    const model = buildCamera3DModel(config);
    model.group.scale.set(0.65, 0.65, 0.65);
    arRoot.add(model.group);
    modelInstanceRef.current = model;

    // Animation & Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      requestAnimFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pulsate Reticle animation
      if (reticleGroup) {
        const pulse = 1 + Math.sin(elapsed * 4) * 0.08;
        reticleGroup.scale.set(pulse, 1, pulse);
      }

      // Alarm Strobe flashing in AR
      if (modelInstanceRef.current && arAlarmActive) {
        const strobePhase = Math.floor(elapsed * 12) % 2;
        if (modelInstanceRef.current.parts.alarmStrobeLeft) {
          modelInstanceRef.current.parts.alarmStrobeLeft.intensity = strobePhase === 0 ? 6 : 0;
        }
        if (modelInstanceRef.current.parts.alarmStrobeRight) {
          modelInstanceRef.current.parts.alarmStrobeRight.intensity = strobePhase === 1 ? 6 : 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestAnimFrameRef.current) {
        cancelAnimationFrame(requestAnimFrameRef.current);
      }
      soundFx.stopAlarmSiren();
      stopCameraStream();
      renderer.dispose();
      scene.clear();
    };
  }, [isOpen, startCameraStream, stopCameraStream, facingMode]);

  // Update model placement & orientation when mode or sliders change
  useEffect(() => {
    if (!arRootGroupRef.current || !modelInstanceRef.current) return;

    // Scale
    const baseScale = placementMode === 'wall' ? 0.65 : placementMode === 'gate' ? 0.72 : 0.55;
    const finalScale = baseScale * scaleFactor;
    modelInstanceRef.current.group.scale.set(finalScale, finalScale, finalScale);

    // Rotation & Elevation
    arRootGroupRef.current.rotation.y = rotationY;
    arRootGroupRef.current.position.y = modelPosRef.current.y + elevationY;

    // Solar tilt adjustment based on placement archetype
    if (placementMode === 'wall') {
      modelInstanceRef.current.parts.solarPanelGroup.rotation.x = -0.45;
      modelInstanceRef.current.parts.wallBracketGroup.position.set(0, 0.4, -0.75);
    } else if (placementMode === 'gate') {
      modelInstanceRef.current.parts.solarPanelGroup.rotation.x = -0.25;
      modelInstanceRef.current.parts.wallBracketGroup.position.set(0, 0.4, -0.75);
    } else {
      // Tabletop/desk stand
      modelInstanceRef.current.parts.solarPanelGroup.rotation.x = -0.15;
    }
  }, [placementMode, scaleFactor, rotationY, elevationY]);

  // Update PTZ lens angles
  useEffect(() => {
    if (modelInstanceRef.current) {
      modelInstanceRef.current.updatePTZ(ptzPan, ptzTilt);
    }
  }, [ptzPan, ptzTilt]);

  // Update materials when user changes color
  useEffect(() => {
    if (modelInstanceRef.current) {
      modelInstanceRef.current.updateConfig(config);
    }
  }, [config]);

  // Touch / Drag event handlers for positioning camera in room
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLockedPlacement) return;

    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      touchStartRef.current = { x: 0, y: 0, dist, angle };
    } else {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      touchStartRef.current = { x: clientX, y: clientY, dist: 0, angle: 0 };
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLockedPlacement || !arRootGroupRef.current) return;

    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      if (touchStartRef.current.dist > 0) {
        // Pinch zoom
        const scaleDelta = dist / touchStartRef.current.dist;
        setScaleFactor((prev) => Math.max(0.4, Math.min(2.5, prev * (1 + (scaleDelta - 1) * 0.5))));

        // Two-finger twist rotation
        const angleDelta = angle - touchStartRef.current.angle;
        setRotationY((prev) => prev - angleDelta * 0.8);
      }

      touchStartRef.current.dist = dist;
      touchStartRef.current.angle = angle;
    } else {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - touchStartRef.current.x) * 0.005;
      const deltaY = (clientY - touchStartRef.current.y) * 0.005;

      modelPosRef.current.x += deltaX;
      modelPosRef.current.y -= deltaY;

      arRootGroupRef.current.position.x = modelPosRef.current.x;
      arRootGroupRef.current.position.y = modelPosRef.current.y + elevationY;

      touchStartRef.current.x = clientX;
      touchStartRef.current.y = clientY;
    }
  };

  // Capture AR Snapshot photo with watermark
  const handleTakeSnapshot = () => {
    soundFx.playCameraShutter();
    if (!canvasRef.current || !videoRef.current) return;

    const snapCanvas = document.createElement('canvas');
    const width = videoRef.current.videoWidth || canvasRef.current.width || 1280;
    const height = videoRef.current.videoHeight || canvasRef.current.height || 720;
    snapCanvas.width = width;
    snapCanvas.height = height;

    const ctx = snapCanvas.getContext('2d');
    if (!ctx) return;

    // Draw live video background
    if (cameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    } else {
      // Dark room gradient simulation
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw 3D Camera layer
    ctx.drawImage(canvasRef.current, 0, 0, width, height);

    // Draw Sleek Watermark & Product Badge
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.roundRect(24, height - 80, 360, 56, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.direction = 'rtl';
    ctx.fillText('كاميرا V380 Pro بالطاقة الشمسية وشريحة 4G', 364, height - 52);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('معاينة الواقع المعزز AR • تجربة التثبيت في الموقع', 364, height - 34);

    // Download snapshot
    const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.download = `V380-AR-Room-Snapshot-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3500);
  };

  // Trigger Police Alarm & Siren test in AR
  const toggleArAlarm = () => {
    const next = !arAlarmActive;
    setArAlarmActive(next);
    if (next) {
      soundFx.startAlarmSiren();
      setTimeout(() => {
        soundFx.playVoiceAlert('تنبيه أمني! تم رصد حركة، جاري إطلاق الإنذار');
      }, 300);
    } else {
      soundFx.stopAlarmSiren();
    }
  };

  // Toggle Floodlight in AR
  const toggleArFloodlight = () => {
    const next = !arFloodlightActive;
    setArFloodlightActive(next);
    soundFx.playClick();
    if (modelInstanceRef.current) {
      modelInstanceRef.current.materials.glowLedMat.emissiveIntensity = next ? 5.0 : 2.5;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-right overflow-hidden select-none">
      
      {/* 1. Camera Viewport & 3D Layer */}
      <div
        ref={containerRef}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="relative flex-1 w-full h-full overflow-hidden cursor-move touch-none"
      >
        {/* Hidden video element feeding the camera stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback Ambient Room Simulation when camera is unavailable */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
              <Scan className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-1">
              محاكاة الغرفة ثلاثية الأبعاد (AR 3D)
            </h3>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed mb-4">
              يمكنك سحب وتدوير وتغيير مقاس الكاميرا لتجربة شكلها على الجدار أو الطاولة. اضغط على زر تفعيل الكاميرا للمعاينة المباشرة عبر كاميرا هاتفك.
            </p>
            <button
              onClick={() => startCameraStream(facingMode)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>إعادة تشغيل كاميرا الجوال</span>
            </button>
          </div>
        )}

        {/* WebGL 3D Canvas Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* 2. Top Header Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-neutral-950/90 via-neutral-950/40 to-transparent flex items-center justify-between z-20 pointer-events-auto">
          
          {/* Brand & AR Mode Pill */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 text-neutral-950 flex items-center justify-center font-bold">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-neutral-100">
                  العرض في غرفتك <span className="text-cyan-400 text-xs">WebXR • AR</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold">
                  مباشر 3D
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 hidden sm:block">
                اسحب وحرّك الكاميرا لتحديد الموقع الأنسب للتثبيت
              </p>
            </div>
          </div>

          {/* Quick Actions (Camera flip, Help, Native WebXR, Close) */}
          <div className="flex items-center gap-2">
            {webXRSupported && (
              <button
                onClick={launchNativeWebXR}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-neutral-950 text-xs font-bold shadow-lg"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>جلسة WebXR</span>
              </button>
            )}

            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
              title="تبديل الكاميرا الخلفية / الأمامية"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowHelpModal(!showHelpModal)}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-cyan-400 transition-colors"
              title="تعليمات الاستخدام"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-rose-950 hover:border-rose-700 transition-colors"
              title="إغلاق الواقع المعزز"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Center Guidance Reticle Banner */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
          <div className="px-4 py-1.5 rounded-full bg-neutral-950/80 border border-cyan-500/40 text-[11px] font-medium text-cyan-300 backdrop-blur-md shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>اسحب بإصبعك لتحريك الكاميرا • قرّب بإصبعين لتغيير الحجم</span>
          </div>
        </div>

        {/* Notification Toast when snapshot is taken */}
        {snapshotSuccess && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 text-xs font-bold backdrop-blur-xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-90 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ صورة المعاينة في جهازك بنجاح! 📸</span>
          </div>
        )}

        {/* Floating Side Action Shortcuts (Snapshot, Alarm, Light) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto">
          {/* Snapshot Photo Button */}
          <button
            onClick={handleTakeSnapshot}
            className="w-12 h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 flex flex-col items-center justify-center shadow-xl shadow-cyan-500/30 transition-transform active:scale-95 group"
            title="التقاط صورة للغرفة مع الكاميرا"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] font-black">لقطة</span>
          </button>

          {/* Alarm Siren Test Button */}
          <button
            onClick={toggleArAlarm}
            className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 ${
              arAlarmActive
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-rose-600/40'
                : 'bg-neutral-900/85 border-neutral-800 text-neutral-300 hover:text-rose-400 hover:border-rose-500/50'
            }`}
            title="تجربة إنذار وصفارة الكاميرا"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[9px] font-bold">إنذار</span>
          </button>

          {/* Floodlight Toggle Button */}
          <button
            onClick={toggleArFloodlight}
            className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 ${
              arFloodlightActive
                ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold shadow-amber-500/40'
                : 'bg-neutral-900/85 border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50'
            }`}
            title="تشغيل كشافات الإضاءة الليلية"
          >
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-bold">كشاف</span>
          </button>
        </div>

      </div>

      {/* 4. Bottom Interactive Control Dashboard */}
      <div className="relative z-20 bg-neutral-950/95 border-t border-neutral-800/90 backdrop-blur-2xl px-4 sm:px-6 py-4 space-y-3">
        
        {/* Navigation Tabs (Placement, Colors, PTZ Swivel) */}
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3 gap-2">
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('controls');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'controls'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              طريقة التثبيت والحجم
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('ptz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ptz'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              تحريك العدسة 360° PTZ
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('presets');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'presets'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              لون الهيكل الخارجي
            </button>
          </div>

          {/* Quick Order Button inside AR */}
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
              onOpenReservation();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>طلب الكاميرا الآن</span>
          </button>
        </div>

        {/* Tab 1: Placement & Scaling Controls */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Placement Mode Selector (Wall / Desk / Outdoor Gate) */}
            <div className="sm:col-span-5 flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setPlacementMode('wall');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  placementMode === 'wall'
                    ? 'bg-neutral-800 border-cyan-400 text-cyan-300'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                تثبيت جداري (شائع)
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setPlacementMode('gate');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  placementMode === 'gate'
                    ? 'bg-neutral-800 border-cyan-400 text-cyan-300'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                بوابة / عمود خارجي
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setPlacementMode('desk');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  placementMode === 'desk'
                    ? 'bg-neutral-800 border-cyan-400 text-cyan-300'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                سطح / طاولة
              </button>
            </div>

            {/* Sliders: Scale & Rotation */}
            <div className="sm:col-span-7 grid grid-cols-2 gap-3">
              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>المقاس الحقيقي (1:1):</span>
                  <span className="text-cyan-400 font-mono font-bold">{Math.round(scaleFactor * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>تدوير الزاوية:</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {Math.round((rotationY * 180) / Math.PI)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.05"
                  value={rotationY}
                  onChange={(e) => setRotationY(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: PTZ Lens Remote Swivel Test */}
        {activeTab === 'ptz' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
            <div className="text-xs text-neutral-300 space-y-1">
              <div className="font-bold text-neutral-100 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>تحكم بعدسة PTZ السفلية المتحركة</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                اختبر حركة دوران الكاميرا لتغطية كافة زوايا غرفتك أو مدخلك
              </p>
            </div>

            {/* Directional PTZ D-Pad Controller */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPtzPan((p) => Math.min(p + 0.3, Math.PI))}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-cyan-400 active:scale-90 transition-transform"
                title="تدوير يميناً"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setPtzTilt((t) => Math.max(t - 0.2, -0.6))}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-cyan-400 active:scale-90 transition-transform"
                  title="إمالة لأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPtzTilt((t) => Math.min(t + 0.2, 0.6))}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-cyan-400 active:scale-90 transition-transform"
                  title="إمالة لأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setPtzPan((p) => Math.max(p - 0.3, -Math.PI))}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-cyan-400 active:scale-90 transition-transform"
                title="تدوير يساراً"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setPtzPan(0);
                  setPtzTilt(0);
                }}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-neutral-400 hover:text-cyan-400"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Material Finish Display */}
        {activeTab === 'presets' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 border border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/20 text-xs font-bold">
              <div
                className="w-4 h-4 rounded-full border border-neutral-600 shadow-inner"
                style={{ backgroundColor: config.material.bodyColor }}
              />
              <span>{config.material.name} (اللون الرسمي المعتمد)</span>
            </div>
          </div>
        )}

      </div>

      {/* 5. Help / Instructions Modal */}
      {showHelpModal && (
        <div className="absolute inset-0 z-40 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-neutral-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>كيفية استخدام الواقع المعزز AR</span>
              </h4>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <strong className="text-cyan-300 block">1. التوجيه نحو الجدار أو المدخل</strong>
                <p>وجّه كاميرا هاتفك نحو الجدار أو السطح الذي تود مراقبته لتظهر الكاميرا في مكانها الافتراضي.</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <strong className="text-cyan-300 block">2. التحريك وتغيير الحجم</strong>
                <p>اسحب بإصبع واحد لتحريك الكاميرا، واستخدم إصبعين للتكبير والتصغير وتدوير زاوية اللوح الشمسي.</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <strong className="text-cyan-300 block">3. التقاط صورة وحفظها</strong>
                <p>اضغط على زر الكاميرا الأزرق لالتقاط صورة عالية الدقة لمشاركتها ومعاينة شكل الكاميرا في منزلك.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
            >
              فهمت، متابعة المعاينة
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
