import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ProductConfig, DimosProduct } from '../types';
import { DIMOS_PRODUCTS } from '../data/dimosStoreData';
import { MATERIAL_PRESETS, WOOD_FINISH_OPTIONS, METAL_ACCENT_OPTIONS, MARBLE_FINISH_OPTIONS } from '../data/productData';
import { DimossLogo } from './DimossLogo';
import { soundFx } from '../utils/audio';
import {
  Camera,
  X,
  RotateCw,
  Maximize,
  Sliders,
  Sparkles,
  Check,
  RefreshCw,
  HelpCircle,
  ShoppingBag,
  Palette,
  Eye,
  Layers,
  Crown,
  Maximize2,
  Scan,
  Compass,
  ArrowUpDown,
  Ruler,
  Smartphone,
  Share2,
} from 'lucide-react';

interface ARRoomViewerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProductConfig;
  onConfigChange: (updates: Partial<ProductConfig>) => void;
  onOpenReservation: () => void;
  activeProduct?: DimosProduct | null;
  onSelectProduct?: (product: DimosProduct) => void;
}

export const ARRoomViewer: React.FC<ARRoomViewerProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
  onOpenReservation,
  activeProduct = null,
  onSelectProduct,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Selected product in AR
  const [selectedProduct, setSelectedProduct] = useState<DimosProduct>(
    activeProduct || DIMOS_PRODUCTS[0]
  );

  useEffect(() => {
    if (activeProduct) {
      setSelectedProduct(activeProduct);
    }
  }, [activeProduct]);

  // ThreeJS AR Engine references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const arRootGroupRef = useRef<THREE.Group | null>(null);
  const requestAnimFrameRef = useRef<number>(0);

  // AR Camera stream & state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'dimensions' | 'colors'>('products');
  const [showRulerGrid, setShowRulerGrid] = useState<boolean>(true);

  // Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; dist: number; angle: number }>({
    x: 0,
    y: 0,
    dist: 0,
    angle: 0,
  });
  const modelPosRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: -0.4, z: -3.5 });

  // Initialize and manage camera stream
  const startCameraStream = useCallback(async (mode: 'environment' | 'user') => {
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
    } catch (err) {
      console.warn('Camera stream fallback to virtual room:', err);
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

  const toggleCameraFacing = () => {
    soundFx.playClick();
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCameraStream(nextMode);
  };

  // Build Procedural 3D Model tailored for each product type in true dimensions
  const buildProduct3DModel = useCallback((prod: DimosProduct, cfg: ProductConfig) => {
    const root = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.material.bodyColor),
      metalness: cfg.material.metalness,
      roughness: cfg.material.roughness,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.material.accentColor),
      roughness: 0.9,
    });

    const woodObj = WOOD_FINISH_OPTIONS.find((w) => w.id === cfg.woodFinish) || WOOD_FINISH_OPTIONS[0];
    const woodMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(woodObj.color),
      roughness: 0.5,
    });

    const metalObj = METAL_ACCENT_OPTIONS.find((m) => m.id === cfg.metalAccent) || METAL_ACCENT_OPTIONS[0];
    const metalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(metalObj.color),
      roughness: 0.2,
      metalness: 0.9,
    });

    const marbleObj = MARBLE_FINISH_OPTIONS.find((m) => m.id === cfg.marbleFinish) || MARBLE_FINISH_OPTIONS[0];
    const marbleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(marbleObj.color),
      roughness: 0.1,
      metalness: 0.1,
    });

    const type = prod.arModelType;

    if (type === 'l_shape') {
      // Large L-Shape Sectional (3.2m x 1.85m)
      const baseGeo = new THREE.BoxGeometry(3.4, 0.18, 1.2);
      const base = new THREE.Mesh(baseGeo, woodMat);
      base.position.set(0, -0.75, 0);
      root.add(base);

      // Chaise lounge extension
      const chaiseBaseGeo = new THREE.BoxGeometry(1.2, 0.18, 1.2);
      const chaiseBase = new THREE.Mesh(chaiseBaseGeo, woodMat);
      chaiseBase.position.set(1.1, -0.75, 1.0);
      root.add(chaiseBase);

      // Cushions
      [-1.1, 0, 1.1].forEach((x) => {
        const cGeo = new THREE.BoxGeometry(1.05, 0.38, 1.1);
        const cMesh = new THREE.Mesh(cGeo, bodyMat);
        cMesh.position.set(x, -0.45, 0.05);
        root.add(cMesh);
      });

      // Chaise cushion
      const chaiseCushGeo = new THREE.BoxGeometry(1.05, 0.38, 1.1);
      const chaiseCush = new THREE.Mesh(chaiseCushGeo, bodyMat);
      chaiseCush.position.set(1.1, -0.45, 1.0);
      root.add(chaiseCush);

      // Backrest
      const backGeo = new THREE.BoxGeometry(3.4, 0.75, 0.3);
      const back = new THREE.Mesh(backGeo, bodyMat);
      back.position.set(0, 0.1, -0.45);
      root.add(back);

      // Armrests
      const armGeo = new THREE.BoxGeometry(0.3, 0.55, 1.2);
      const leftArm = new THREE.Mesh(armGeo, bodyMat);
      leftArm.position.set(-1.75, -0.1, 0);
      root.add(leftArm);

      // Accent Pillows
      const pGeo = new THREE.BoxGeometry(0.45, 0.45, 0.18);
      const p1 = new THREE.Mesh(pGeo, accentMat);
      p1.position.set(-1.3, -0.05, -0.1);
      p1.rotation.set(-0.2, 0.3, 0);
      root.add(p1);
    } else if (type === 'recliner') {
      // Ergonomic Motion Recliner
      const seatGeo = new THREE.BoxGeometry(1.0, 0.4, 0.95);
      const seat = new THREE.Mesh(seatGeo, bodyMat);
      seat.position.set(0, -0.4, 0);
      root.add(seat);

      const backGeo = new THREE.BoxGeometry(0.95, 0.95, 0.3);
      const back = new THREE.Mesh(backGeo, bodyMat);
      back.position.set(0, 0.25, -0.35);
      back.rotation.x = -0.15;
      root.add(back);

      const headrestGeo = new THREE.BoxGeometry(0.8, 0.3, 0.25);
      const headrest = new THREE.Mesh(headrestGeo, bodyMat);
      headrest.position.set(0, 0.8, -0.4);
      root.add(headrest);

      const footrestGeo = new THREE.BoxGeometry(0.9, 0.2, 0.5);
      const footrest = new THREE.Mesh(footrestGeo, bodyMat);
      footrest.position.set(0, -0.6, 0.65);
      footrest.rotation.x = 0.25;
      root.add(footrest);

      // Swivel Base
      const baseGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.12, 32);
      const base = new THREE.Mesh(baseGeo, metalMat);
      base.position.set(0, -0.85, 0);
      root.add(base);
    } else if (type === 'bed') {
      // King Size Bed (2.0m x 2.0m)
      const headboardGeo = new THREE.BoxGeometry(2.4, 1.4, 0.25);
      const headboard = new THREE.Mesh(headboardGeo, bodyMat);
      headboard.position.set(0, 0.1, -1.1);
      root.add(headboard);

      const mattressGeo = new THREE.BoxGeometry(2.0, 0.45, 2.0);
      const mattress = new THREE.Mesh(mattressGeo, bodyMat);
      mattress.position.set(0, -0.38, 0);
      root.add(mattress);

      const duvetGeo = new THREE.BoxGeometry(2.05, 0.2, 1.4);
      const duvet = new THREE.Mesh(duvetGeo, accentMat);
      duvet.position.set(0, -0.15, 0.3);
      root.add(duvet);

      // Pillows
      [-0.55, 0.55].forEach((px) => {
        const pillowGeo = new THREE.BoxGeometry(0.65, 0.25, 0.4);
        const pillow = new THREE.Mesh(pillowGeo, bodyMat);
        pillow.position.set(px, -0.05, -0.7);
        pillow.rotation.x = 0.2;
        root.add(pillow);
      });

      // Bedside Tables
      [-1.35, 1.35].forEach((nx) => {
        const nsGeo = new THREE.BoxGeometry(0.5, 0.5, 0.45);
        const ns = new THREE.Mesh(nsGeo, woodMat);
        ns.position.set(nx, -0.55, -0.9);
        root.add(ns);
      });
    } else if (type === 'coffee_table') {
      // Marble Coffee Table Set
      const topGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.06, 40);
      const top = new THREE.Mesh(topGeo, marbleMat);
      top.position.set(0, -0.45, 0);
      root.add(top);

      const legGeo = new THREE.CylinderGeometry(0.6, 0.65, 0.45, 32);
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(0, -0.7, 0);
      root.add(leg);

      // Smaller Nesting Table
      const subTopGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
      const subTop = new THREE.Mesh(subTopGeo, marbleMat);
      subTop.position.set(0.85, -0.35, 0.3);
      root.add(subTop);
    } else if (type === 'dining_table') {
      // 8-Seater Dining Table
      const tableGeo = new THREE.BoxGeometry(2.4, 0.08, 1.1);
      const tableTop = new THREE.Mesh(tableGeo, marbleMat);
      tableTop.position.set(0, -0.1, 0);
      root.add(tableTop);

      // Legs
      [-0.9, 0.9].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.8), woodMat);
        leg.position.set(lx, -0.5, 0);
        root.add(leg);
      });

      // Chairs around table
      [-0.7, 0, 0.7].forEach((cx) => {
        // Front chairs
        const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), bodyMat);
        c1.position.set(cx, -0.45, 0.8);
        root.add(c1);

        // Back chairs
        const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), bodyMat);
        c2.position.set(cx, -0.45, -0.8);
        root.add(c2);
      });
    } else {
      // Default: 3-Seater / Modular Sofa
      const baseGeo = new THREE.BoxGeometry(2.8, 0.18, 1.1);
      const base = new THREE.Mesh(baseGeo, woodMat);
      base.position.set(0, -0.75, 0);
      root.add(base);

      [-0.85, 0, 0.85].forEach((cx) => {
        const seatGeo = new THREE.BoxGeometry(0.82, 0.38, 0.95);
        const seat = new THREE.Mesh(seatGeo, bodyMat);
        seat.position.set(cx, -0.45, 0.05);
        root.add(seat);
      });

      const backGeo = new THREE.BoxGeometry(2.8, 0.7, 0.3);
      const back = new THREE.Mesh(backGeo, bodyMat);
      back.position.set(0, 0.1, -0.4);
      root.add(back);

      const armGeo = new THREE.BoxGeometry(0.28, 0.55, 1.05);
      const leftArm = new THREE.Mesh(armGeo, bodyMat);
      leftArm.position.set(-1.45, -0.1, 0);
      root.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, bodyMat);
      rightArm.position.set(1.45, -0.1, 0);
      root.add(rightArm);
    }

    return root;
  }, []);

  // Initialize ThreeJS AR Canvas
  useEffect(() => {
    if (!isOpen) return;

    startCameraStream(facingMode);

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.3, 0);
    cameraRef.current = camera;

    // WebGL Renderer with Alpha
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

    // AR Root Object
    const arRoot = new THREE.Group();
    arRoot.position.set(modelPosRef.current.x, modelPosRef.current.y, modelPosRef.current.z);
    scene.add(arRoot);
    arRootGroupRef.current = arRoot;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.8);
    scene.add(ambientLight);

    const sunKey = new THREE.DirectionalLight(0xffffff, 2.5);
    sunKey.position.set(4, 7, 5);
    sunKey.castShadow = true;
    scene.add(sunKey);

    const bounceWarm = new THREE.PointLight(0xd4af37, 2.0, 10);
    bounceWarm.position.set(-2, 3, 2);
    scene.add(bounceWarm);

    // Floor Shadow Receiver
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.0;
    shadowPlane.receiveShadow = true;
    arRoot.add(shadowPlane);

    // Floor Metric Grid (1m x 1m lines)
    const gridHelper = new THREE.GridHelper(6, 6, 0xd4af37, 0x555555);
    gridHelper.position.y = -0.99;
    gridHelper.name = 'metricGrid';
    arRoot.add(gridHelper);

    // Build Model
    const modelGroup = buildProduct3DModel(selectedProduct, config);
    arRoot.add(modelGroup);
    furnitureGroupRef.current = modelGroup;

    // Render loop
    const animate = () => {
      requestAnimFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

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
      stopCameraStream();
      renderer.dispose();
      scene.clear();
    };
  }, [isOpen, startCameraStream, stopCameraStream, facingMode, selectedProduct, buildProduct3DModel, config]);

  // Update scale & rotation
  useEffect(() => {
    if (!arRootGroupRef.current || !furnitureGroupRef.current) return;
    furnitureGroupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    arRootGroupRef.current.rotation.y = rotationY;
  }, [scaleFactor, rotationY]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current = { x: 0, y: 0, dist: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) };
    } else {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      touchStartRef.current = { x: clientX, y: clientY, dist: 0, angle: 0 };
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!arRootGroupRef.current) return;

    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      if (touchStartRef.current.dist > 0) {
        const scaleDelta = dist / touchStartRef.current.dist;
        setScaleFactor((prev) => Math.max(0.4, Math.min(2.0, prev * (1 + (scaleDelta - 1) * 0.5))));
        const angleDelta = angle - touchStartRef.current.angle;
        setRotationY((prev) => prev - angleDelta * 0.8);
      }

      touchStartRef.current.dist = dist;
      touchStartRef.current.angle = angle;
    } else {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - touchStartRef.current.x) * 0.006;
      const deltaY = (clientY - touchStartRef.current.y) * 0.006;

      modelPosRef.current.x += deltaX;
      modelPosRef.current.y -= deltaY;

      arRootGroupRef.current.position.x = modelPosRef.current.x;
      arRootGroupRef.current.position.y = modelPosRef.current.y;

      touchStartRef.current.x = clientX;
      touchStartRef.current.y = clientY;
    }
  };

  // Capture Photo with official Dimos stamp
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

    if (cameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(canvasRef.current, 0, 0, width, height);

    // Official Stamp
    ctx.fillStyle = 'rgba(12, 10, 9, 0.9)';
    ctx.roundRect(24, height - 90, 480, 68, 16);
    ctx.fill();

    ctx.fillStyle = '#E30613';
    ctx.font = 'bold 18px sans-serif';
    ctx.direction = 'rtl';
    ctx.fillText(`ديموس • ${selectedProduct.title}`, 480, height - 60);

    ctx.fillStyle = '#d4af37';
    ctx.font = '12px sans-serif';
    ctx.fillText(`المقاس الحقيقي: ${selectedProduct.dimensions.formatted}`, 480, height - 38);

    const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.download = `Dimoss-AR-${selectedProduct.sku}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3500);
  };

  const handleProductChange = (prod: DimosProduct) => {
    soundFx.playClick();
    setSelectedProduct(prod);
    setScaleFactor(1.0); // Reset to 1:1 true scale
    if (onSelectProduct) {
      onSelectProduct(prod);
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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-neutral-950 to-stone-900 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 animate-pulse">
              <Scan className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-1">
              معاينة {selectedProduct.title} في غرفتك (AR 3D)
            </h3>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed mb-4">
              المقاس الحقيقي 1:1 ({selectedProduct.dimensions.formatted}). اضغط لتفعيل الكاميرا وإسقاط القطعة في صالتك أو مجلسك مباشرة.
            </p>
            <button
              onClick={() => startCameraStream(facingMode)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-900/40"
            >
              <Camera className="w-4 h-4" />
              <span>تشغيل كاميرا الجوال للواقع المعزز</span>
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Top Header Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-neutral-950/95 via-neutral-950/60 to-transparent flex items-center justify-between z-20 pointer-events-auto">
          
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white shadow-md border border-neutral-200">
              <DimossLogo variant="full" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm text-neutral-100">
                  {selectedProduct.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/50 text-[10px] font-bold">
                  AR 1:1
                </span>
              </div>
              <p className="text-[11px] text-amber-400 font-bold hidden sm:block">
                📏 {selectedProduct.dimensions.formatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setScaleFactor(1.0); // Reset to 1:1 true metric
              }}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-700 text-amber-400 hover:text-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
              title="إعادة ضبط المقاس للأبعاد الحقيقية 1:1"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>1:1 حقيقي</span>
            </button>

            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
              title="تبديل الكاميرا الخلفية / الأمامية"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowHelpModal(!showHelpModal)}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
              title="تعليمات الاستخدام"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-red-950 transition-colors"
              title="إغلاق الواقع المعزز"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Guidance Reticle Banner */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
          <div className="px-4 py-1.5 rounded-full bg-neutral-950/85 border border-red-500/40 text-[11px] font-bold text-neutral-200 backdrop-blur-md shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>اسحب بإصبعك لتحريك المنتج • قرّب بإصبعين لتكبير وتدوير الزاوية</span>
          </div>
        </div>

        {/* Toast */}
        {snapshotSuccess && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-red-950/95 border border-red-500 text-red-100 text-xs font-bold backdrop-blur-xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-90 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ صورة الغرفة مع مواصفات ومقاسات ديموس في ألبوم الصور! 📸</span>
          </div>
        )}

        {/* Floating Snapshot & Price Overlay */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={handleTakeSnapshot}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-500 text-white flex flex-col items-center justify-center shadow-xl shadow-red-900/40 transition-transform active:scale-95 group"
            title="التقاط صورة للغرفة مع منتج ديموس"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] font-black">لقطة</span>
          </button>
        </div>

      </div>

      {/* Bottom Interactive Dashboard */}
      <div className="relative z-20 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-2xl px-4 sm:px-6 py-4 space-y-3">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 gap-2">
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('products');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              تبديل المنتج في AR
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('dimensions');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dimensions'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              المقاس وتدوير الزاوية
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('colors');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'colors'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              الخامة والألوان
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-neutral-100">
                {selectedProduct.price.toLocaleString()} ر.س
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">
                أو {Math.round(selectedProduct.tabbyInstallment)} ر.س / شهر
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
                onOpenReservation();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-black text-xs shadow-lg shadow-red-900/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>طلب هذا الموديل الآن</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Products Quick Carousel in AR */}
        {activeTab === 'products' && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {DIMOS_PRODUCTS.map((prod) => {
              const isCurrent = prod.id === selectedProduct.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => handleProductChange(prod)}
                  className={`flex items-center gap-2.5 p-2 rounded-2xl border shrink-0 text-right transition-all ${
                    isCurrent
                      ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50 scale-105'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <img src={prod.image} alt={prod.arabicTitle} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs font-bold line-clamp-1 max-w-[140px]">{prod.title}</div>
                    <div className="text-[10px] text-amber-400 font-bold">{prod.price.toLocaleString()} ر.س</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Dimensions & Rotation */}
        {activeTab === 'dimensions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>المقياس الحقيقي (Scale):</span>
                <span className="text-amber-400 font-mono font-bold">{Math.round(scaleFactor * 100)}% {scaleFactor === 1 ? '(1:1 أبعاد حقيقية)' : ''}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>تدوير زاوية المنتج:</span>
                <span className="text-amber-400 font-mono font-bold">
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
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Colors */}
        {activeTab === 'colors' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {selectedProduct.colors.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playFabricSwatch();
                  onConfigChange({
                    material: {
                      ...config.material,
                      bodyColor: c.hex,
                      name: c.name,
                    },
                  });
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-red-400 text-xs font-bold shrink-0 transition-all"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-neutral-600" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="absolute inset-0 z-40 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-neutral-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-500" />
                <span>طريقة تجربة منتجات ديموس بالواقع المعزز AR</span>
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
                <strong className="text-red-400 block">1. توجيه الكاميرا نحو أرضية الصالة أو المجلس</strong>
                <p>وجّه كاميرا هاتفك نحو الأرضية لتظهر القطعة بالأبعاد الواقعية 1:1 بالسنتيمتر.</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <strong className="text-red-400 block">2. التحريك والتنسيق الدقيق</strong>
                <p>اسحب بإصبعك لتحديد المكان المناسب في الصالة وتدوير الزاوية نحو التلفزيون أو المدخل.</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <strong className="text-red-400 block">3. التقاط صورة وحفظها</strong>
                <p>اضغط على زر الكاميرا لالتقاط صورة ومشاركتها مع العائلة أو مهندس الديكور عبر الواتساب.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              فهمت، متابعة التجربة
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
