import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ProductConfig, HotspotAnnotation } from '../../types';
import { HOTSPOT_ANNOTATIONS } from '../../data/productData';
import { soundFx } from '../../utils/audio';
import {
  Maximize2,
  RotateCcw,
  Box,
  Eye,
  Camera,
  Sun,
  ShieldAlert,
  Sparkles,
  BellRing,
  Volume2,
  VolumeX,
  Mic,
  Radio,
  Flame,
  AlertTriangle,
  Play,
  Square,
  Activity,
} from 'lucide-react';

interface Scene3DProps {
  config: ProductConfig;
  onConfigChange?: (updates: Partial<ProductConfig>) => void;
  onSelectHotspot?: (hotspot: HotspotAnnotation | null) => void;
  onOpenAR?: () => void;
  interactive?: boolean;
  className?: string;
  showControlsOverlay?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  config,
  onConfigChange,
  onSelectHotspot,
  onOpenAR,
  interactive = true,
  className = '',
  showControlsOverlay = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const partsGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Motion Detection & Intelligent Voice Alert State
  const [isMotionSimulating, setIsMotionSimulating] = useState(false);
  const [alertSeconds, setAlertSeconds] = useState(0);
  const [isTwoWayTalking, setIsTwoWayTalking] = useState(false);
  const motionTimerRef = useRef<number | null>(null);
  const isSimulatingRef = useRef(false);
  isSimulatingRef.current = isMotionSimulating;

  // Mesh part references for exploded view & animation
  const partsRef = useRef<{
    solarPanelGroup?: THREE.Group;
    fixedLensGroup?: THREE.Group;
    ptzDomeGroup?: THREE.Group;
    ptzInnerSphere?: THREE.Group;
    antennasGroup?: THREE.Group;
    batteryGroup?: THREE.Group;
    wallBracketGroup?: THREE.Group;
    alarmStrobeLeft?: THREE.PointLight;
    alarmStrobeRight?: THREE.PointLight;
    floodlightGroup?: THREE.Group;
    gridFloor?: THREE.GridHelper;
  }>({});

  // Dynamic hotspot 2D screen coordinates
  const [projectedHotspots, setProjectedHotspots] = useState<
    { id: string; x: number; y: number; visible: boolean; annotation: HotspotAnnotation }[]
  >([]);

  // Orbit & Mouse Interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.2 });
  const currentRotationRef = useRef({ x: 0.15, y: -0.2 });
  const targetDistanceRef = useRef(5.4);
  const currentDistanceRef = useRef(5.4);
  const explodedProgressLerpRef = useRef(0);
  const animationFrameIdRef = useRef<number>(0);

  // Lighting updater
  const updateLighting = useCallback((preset: ProductConfig['lightingPreset'], lightsGroup: THREE.Group) => {
    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    lightsGroup.add(ambientLight);

    if (preset === 'studio') {
      // Bright daylight sunshine for solar panel
      const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
      sunLight.position.set(6, 10, 6);
      const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
      fillLight.position.set(-6, 4, -4);
      const groundBounce = new THREE.PointLight(0x0284c7, 1.8, 20);
      groundBounce.position.set(0, -4, 4);
      lightsGroup.add(sunLight, fillLight, groundBounce);
    } else if (preset === 'cyber_neon') {
      // Red and blue security strobe lighting
      const redLight = new THREE.PointLight(0xff0044, 4.0, 20);
      redLight.position.set(-5, 3, 4);
      const blueLight = new THREE.PointLight(0x0066ff, 4.0, 20);
      blueLight.position.set(5, 3, 4);
      const topKey = new THREE.DirectionalLight(0xffffff, 0.8);
      topKey.position.set(0, 8, 2);
      lightsGroup.add(redLight, blueLight, topKey);
    } else if (preset === 'sunset_amber') {
      const sunKey = new THREE.DirectionalLight(0xff8800, 3.2);
      sunKey.position.set(7, 5, 4);
      const warmFill = new THREE.DirectionalLight(0xff3300, 1.0);
      warmFill.position.set(-6, -2, -3);
      const skyRim = new THREE.PointLight(0x38bdf8, 2.0, 20);
      skyRim.position.set(0, 6, -5);
      lightsGroup.add(sunKey, warmFill, skyRim);
    } else if (preset === 'deep_void') {
      ambientLight.intensity = 0.25;
      const spotWhite = new THREE.SpotLight(0xffffff, 4.5, 30, Math.PI / 5, 0.3);
      spotWhite.position.set(4, 6, 6);
      const irLight = new THREE.PointLight(0x9333ea, 2.5, 15);
      irLight.position.set(-4, -2, -3);
      lightsGroup.add(spotWhite, irLight);
    } else if (preset === 'emerald_matrix') {
      const pirGreen = new THREE.PointLight(0x10b981, 4.0, 20);
      pirGreen.position.set(0, -2, 5);
      const cyanFill = new THREE.DirectionalLight(0x06b6d4, 1.8);
      cyanFill.position.set(-5, 4, 3);
      lightsGroup.add(pirGreen, cyanFill);
    }
  }, []);

  // Initialize ThreeJS Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.4);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    // Lighting container
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    updateLighting(config.lightingPreset, lightsGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(16, 24, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -2.6;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // Master Parts Group
    const masterPartsGroup = new THREE.Group();
    scene.add(masterPartsGroup);
    partsGroupRef.current = masterPartsGroup;

    // -------------------------------------------------------------
    // BUILD 3D CAMERA MESHES (SOLAR 4G DUAL-LENS V380 PRO)
    // -------------------------------------------------------------

    // Material generator based on config
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.material.bodyColor),
      metalness: config.material.metalness,
      roughness: config.material.roughness,
      wireframe: config.isWireframe,
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x18181b),
      metalness: 0.8,
      roughness: 0.25,
      wireframe: config.isWireframe,
    });

    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0f172a),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      ior: 1.6,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: config.isWireframe,
    });

    const glowLedMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.coreGlowColor),
      emissive: new THREE.Color(config.coreGlowColor),
      emissiveIntensity: 2.5,
      wireframe: config.isWireframe,
    });

    const solarCellMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0c1e3d),
      metalness: 0.9,
      roughness: 0.15,
      wireframe: config.isWireframe,
    });

    const solarFrameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x27272a),
      metalness: 0.85,
      roughness: 0.3,
      wireframe: config.isWireframe,
    });

    // 1. SOLAR PANEL GROUP (Top)
    const solarGroup = new THREE.Group();
    solarGroup.position.set(0, 1.75, -0.3);
    solarGroup.rotation.x = -0.42; // Tilted towards sunlight

    // Solar Panel base plate
    const solarBaseGeo = new THREE.BoxGeometry(2.8, 0.08, 1.8);
    const solarBaseMesh = new THREE.Mesh(solarBaseGeo, solarFrameMat);
    solarGroup.add(solarBaseMesh);

    // Solar Cells Grid Surface
    const solarGridGeo = new THREE.PlaneGeometry(2.68, 1.68);
    const solarGridMesh = new THREE.Mesh(solarGridGeo, solarCellMat);
    solarGridMesh.rotation.x = -Math.PI / 2;
    solarGridMesh.position.y = 0.045;
    solarGroup.add(solarGridMesh);

    // Solar Panel Support Arm & Ball Joint
    const solarArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16);
    const solarArmMesh = new THREE.Mesh(solarArmGeo, darkTrimMat);
    solarArmMesh.position.set(0, -0.3, -0.2);
    solarArmMesh.rotation.x = 0.5;
    solarGroup.add(solarArmMesh);

    masterPartsGroup.add(solarGroup);
    partsRef.current.solarPanelGroup = solarGroup;

    // 2. WALL BRACKET & SIM/TF CARD SLOT (Back)
    const bracketGroup = new THREE.Group();
    bracketGroup.position.set(0, 0.4, -0.75);

    const wallPlateGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24);
    const wallPlateMesh = new THREE.Mesh(wallPlateGeo, darkTrimMat);
    wallPlateMesh.rotation.x = Math.PI / 2;
    bracketGroup.add(wallPlateMesh);

    const bracketArmGeo = new THREE.BoxGeometry(0.38, 0.45, 0.7);
    const bracketArmMesh = new THREE.Mesh(bracketArmGeo, bodyMat);
    bracketArmMesh.position.set(0, 0, 0.35);
    bracketGroup.add(bracketArmMesh);

    // SIM & TF Card Cover Plate
    const cardSlotCoverGeo = new THREE.BoxGeometry(0.06, 0.22, 0.28);
    const cardSlotCoverMesh = new THREE.Mesh(cardSlotCoverGeo, darkTrimMat);
    cardSlotCoverMesh.position.set(0.2, 0, 0.35);
    bracketGroup.add(cardSlotCoverMesh);

    masterPartsGroup.add(bracketGroup);
    partsRef.current.wallBracketGroup = bracketGroup;

    // 3. DUAL 4G ANTENNAS (Sides / Rear)
    const antennasGroup = new THREE.Group();
    antennasGroup.position.set(0, 0.7, -0.4);

    const antennaGeo = new THREE.CylinderGeometry(0.04, 0.035, 1.4, 16);
    const antennaLeft = new THREE.Mesh(antennaGeo, darkTrimMat);
    antennaLeft.position.set(-0.65, 0.65, 0);
    antennaLeft.rotation.z = 0.08;
    antennasGroup.add(antennaLeft);

    const antennaRight = new THREE.Mesh(antennaGeo, darkTrimMat);
    antennaRight.position.set(0.65, 0.65, 0);
    antennaRight.rotation.z = -0.08;
    antennasGroup.add(antennaRight);

    masterPartsGroup.add(antennasGroup);
    partsRef.current.antennasGroup = antennasGroup;

    // 4. INTEGRATED BATTERY & TOP HOUSING (Middle Dome)
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 0.75, 0);

    const topHousingGeo = new THREE.CylinderGeometry(0.55, 0.62, 0.65, 32);
    const topHousingMesh = new THREE.Mesh(topHousingGeo, bodyMat);
    batteryGroup.add(topHousingMesh);

    // Status LED Ring
    const ringGeo = new THREE.TorusGeometry(0.58, 0.025, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, glowLedMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.1;
    batteryGroup.add(ringMesh);

    masterPartsGroup.add(batteryGroup);
    partsRef.current.batteryGroup = batteryGroup;

    // 5. UPPER MODULE - FIXED LENS CAMERA
    const fixedLensGroup = new THREE.Group();
    fixedLensGroup.position.set(0, 0.35, 0.25);

    const fixedBodyGeo = new THREE.BoxGeometry(0.95, 0.75, 0.7);
    const fixedBodyMesh = new THREE.Mesh(fixedBodyGeo, bodyMat);
    fixedLensGroup.add(fixedBodyMesh);

    // Fixed Lens Bezel
    const fixedLensBezelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 32);
    const fixedLensBezelMesh = new THREE.Mesh(fixedLensBezelGeo, darkTrimMat);
    fixedLensBezelMesh.rotation.x = Math.PI / 2;
    fixedLensBezelMesh.position.set(0, 0.05, 0.36);
    fixedLensGroup.add(fixedLensBezelMesh);

    // Fixed Lens Glass
    const fixedLensGlassGeo = new THREE.SphereGeometry(0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const fixedLensGlassMesh = new THREE.Mesh(fixedLensGlassGeo, lensGlassMat);
    fixedLensGlassMesh.rotation.x = Math.PI / 2;
    fixedLensGlassMesh.position.set(0, 0.05, 0.4);
    fixedLensGroup.add(fixedLensGlassMesh);

    // Fixed Module 6x White Floodlight LEDs surrounding the lens
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const ledGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16);
      const ledMesh = new THREE.Mesh(ledGeo, glowLedMat);
      ledMesh.rotation.x = Math.PI / 2;
      ledMesh.position.set(Math.cos(angle) * 0.32, 0.05 + Math.sin(angle) * 0.24, 0.36);
      fixedLensGroup.add(ledMesh);
    }

    masterPartsGroup.add(fixedLensGroup);
    partsRef.current.fixedLensGroup = fixedLensGroup;

    // 6. LOWER MODULE - 360° PTZ ROTATING DOME CAMERA
    const ptzDomeGroup = new THREE.Group();
    ptzDomeGroup.position.set(0, -0.65, 0.1);

    // PTZ Motorized Swivel Fork
    const forkBaseGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
    const forkBaseMesh = new THREE.Mesh(forkBaseGeo, darkTrimMat);
    forkBaseMesh.position.y = 0.35;
    ptzDomeGroup.add(forkBaseMesh);

    // PTZ Rotating Inner Sphere
    const ptzInnerSphere = new THREE.Group();
    ptzDomeGroup.add(ptzInnerSphere);
    partsRef.current.ptzInnerSphere = ptzInnerSphere;

    const sphereDomeGeo = new THREE.SphereGeometry(0.56, 32, 32);
    const sphereDomeMesh = new THREE.Mesh(sphereDomeGeo, bodyMat);
    ptzInnerSphere.add(sphereDomeMesh);

    // Center Main PTZ Zoom Lens
    const ptzBezelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 32);
    const ptzBezelMesh = new THREE.Mesh(ptzBezelGeo, darkTrimMat);
    ptzBezelMesh.rotation.x = Math.PI / 2;
    ptzBezelMesh.position.set(0, 0, 0.48);
    ptzInnerSphere.add(ptzBezelMesh);

    const ptzGlassGeo = new THREE.SphereGeometry(0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const ptzGlassMesh = new THREE.Mesh(ptzGlassGeo, lensGlassMat);
    ptzGlassMesh.rotation.x = Math.PI / 2;
    ptzGlassMesh.position.set(0, 0, 0.54);
    ptzInnerSphere.add(ptzGlassMesh);

    // 4x White Floodlights + 4x Infrared LED Array
    for (let j = 0; j < 8; j++) {
      const angle = (j / 8) * Math.PI * 2;
      const r = 0.38;
      const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16);
      const isWhite = j % 2 === 0;
      const ledMat = isWhite ? glowLedMat : new THREE.MeshStandardMaterial({
        color: 0x9333ea,
        emissive: 0x9333ea,
        emissiveIntensity: 2.0,
      });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.rotation.x = Math.PI / 2;
      ledMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.44);
      ptzInnerSphere.add(ledMesh);
    }

    // Bottom PIR Motion Sensor (White dome bubble)
    const pirGeo = new THREE.SphereGeometry(0.12, 20, 20);
    const pirMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
    });
    const pirMesh = new THREE.Mesh(pirGeo, pirMat);
    pirMesh.position.set(0, -0.46, 0.32);
    ptzInnerSphere.add(pirMesh);

    // Speaker Grille slots at bottom
    const speakerRingGeo = new THREE.TorusGeometry(0.22, 0.02, 12, 32);
    const speakerMesh = new THREE.Mesh(speakerRingGeo, darkTrimMat);
    speakerMesh.rotation.x = Math.PI / 2;
    speakerMesh.position.y = -0.52;
    ptzInnerSphere.add(speakerMesh);

    // Alarm Emergency Strobe Lights (Red & Blue)
    const alarmLeft = new THREE.PointLight(0xff0033, 0, 8);
    alarmLeft.position.set(-0.5, 0.2, 0.4);
    ptzDomeGroup.add(alarmLeft);
    partsRef.current.alarmStrobeLeft = alarmLeft;

    const alarmRight = new THREE.PointLight(0x0066ff, 0, 8);
    alarmRight.position.set(0.5, 0.2, 0.4);
    ptzDomeGroup.add(alarmRight);
    partsRef.current.alarmStrobeRight = alarmRight;

    masterPartsGroup.add(ptzDomeGroup);
    partsRef.current.ptzDomeGroup = ptzDomeGroup;

    // -------------------------------------------------------------
    // RENDER LOOP & 3D ANIMATIONS
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Lerp for Orbit Controls
      if (!isDraggingRef.current) {
        if (config.autoRotate) {
          targetRotationRef.current.y += 0.008 * config.rotationSpeed;
        } else {
          targetRotationRef.current.y += rotationVelocityRef.current.y;
          targetRotationRef.current.x += rotationVelocityRef.current.x;
          rotationVelocityRef.current.y *= 0.94;
          rotationVelocityRef.current.x *= 0.94;
        }
      }

      // Clamp vertical pitch rotation
      targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x));

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * 0.1;

      // Apply camera orbital position
      if (cameraRef.current) {
        const dist = currentDistanceRef.current;
        const rx = currentRotationRef.current.x;
        const ry = currentRotationRef.current.y;

        cameraRef.current.position.x = dist * Math.sin(ry) * Math.cos(rx);
        cameraRef.current.position.y = 0.2 + dist * Math.sin(rx);
        cameraRef.current.position.z = dist * Math.cos(ry) * Math.cos(rx);
        cameraRef.current.lookAt(0, 0.1, 0);
      }

      // Exploded View Lerping
      const targetExplode = config.isExploded ? (config.explodedProgress > 0 ? config.explodedProgress : 1) : 0;
      explodedProgressLerpRef.current += (targetExplode - explodedProgressLerpRef.current) * 0.1;
      const ep = explodedProgressLerpRef.current;

      // Explode individual part positions smoothly
      if (partsRef.current.solarPanelGroup) {
        partsRef.current.solarPanelGroup.position.set(0, 1.75 + ep * 1.2, -0.3 - ep * 0.4);
      }
      if (partsRef.current.fixedLensGroup) {
        partsRef.current.fixedLensGroup.position.set(0, 0.35 + ep * 0.6, 0.25 + ep * 1.4);
      }
      if (partsRef.current.ptzDomeGroup) {
        partsRef.current.ptzDomeGroup.position.set(0, -0.65 - ep * 1.2, 0.1 + ep * 0.6);
      }
      if (partsRef.current.antennasGroup) {
        partsRef.current.antennasGroup.position.set(0, 0.7 + ep * 0.4, -0.4 - ep * 0.6);
      }
      if (partsRef.current.batteryGroup) {
        partsRef.current.batteryGroup.position.set(0, 0.75 + ep * 0.9, -ep * 0.2);
      }
      if (partsRef.current.wallBracketGroup) {
        partsRef.current.wallBracketGroup.position.set(0, 0.4, -0.75 - ep * 1.2);
      }

      // PTZ Dome Manual Control vs Auto Cruise vs Idle Scanning
      if (partsRef.current.ptzInnerSphere && !config.isExploded) {
        if (isSimulatingRef.current) {
          // Rapid motorized tracking lock-on
          const trackAngle = Math.sin(time * 3.2) * 0.7;
          const trackTilt = Math.cos(time * 2.8) * 0.35 + 0.1;
          partsRef.current.ptzInnerSphere.rotation.y = trackAngle;
          partsRef.current.ptzInnerSphere.rotation.x = trackTilt;
        } else if (config.ptzAutoCruise) {
          // Continuous 360 cruise scan
          partsRef.current.ptzInnerSphere.rotation.y = (time * 0.7) % (Math.PI * 2);
          partsRef.current.ptzInnerSphere.rotation.x = Math.sin(time * 0.4) * 0.25;
        } else if (typeof config.ptzPanAngle === 'number' && typeof config.ptzTiltAngle === 'number') {
          // Manual joystick / controller input with smooth damping
          const targetPan = (config.ptzPanAngle * Math.PI) / 180;
          const targetTilt = (config.ptzTiltAngle * Math.PI) / 180;
          partsRef.current.ptzInnerSphere.rotation.y = THREE.MathUtils.lerp(
            partsRef.current.ptzInnerSphere.rotation.y,
            targetPan,
            0.12
          );
          partsRef.current.ptzInnerSphere.rotation.x = THREE.MathUtils.lerp(
            partsRef.current.ptzInnerSphere.rotation.x,
            targetTilt,
            0.12
          );
        } else {
          const scanAngle = Math.sin(time * 0.8) * 0.4;
          const tiltAngle = Math.cos(time * 0.5) * 0.15;
          partsRef.current.ptzInnerSphere.rotation.y = scanAngle;
          partsRef.current.ptzInnerSphere.rotation.x = tiltAngle;
        }
      }

      // Flashing Alarm Strobe (Police Red & Blue) or Floodlight illumination
      if (config.lightingPreset === 'cyber_neon' || config.alarmActive || isSimulatingRef.current) {
        const strobeFreq = isSimulatingRef.current ? 22 : 12;
        const strobe = Math.sin(time * strobeFreq);
        if (partsRef.current.alarmStrobeLeft) {
          partsRef.current.alarmStrobeLeft.intensity = strobe > 0 ? 7.0 : 0;
        }
        if (partsRef.current.alarmStrobeRight) {
          partsRef.current.alarmStrobeRight.intensity = strobe < 0 ? 7.0 : 0;
        }
      } else if (config.floodlightActive) {
        if (partsRef.current.alarmStrobeLeft) partsRef.current.alarmStrobeLeft.intensity = 5.0;
        if (partsRef.current.alarmStrobeRight) partsRef.current.alarmStrobeRight.intensity = 5.0;
      } else {
        if (partsRef.current.alarmStrobeLeft) partsRef.current.alarmStrobeLeft.intensity = 0;
        if (partsRef.current.alarmStrobeRight) partsRef.current.alarmStrobeRight.intensity = 0;
      }

      // Hotspots Projection calculation
      if (cameraRef.current && mountRef.current && interactive) {
        const rect = mountRef.current.getBoundingClientRect();
        const projected = HOTSPOT_ANNOTATIONS.map((annotation) => {
          const basePos = new THREE.Vector3(...annotation.position3D);
          const explodedOffset = new THREE.Vector3(...annotation.explodedOffset);
          const currentPos = basePos.clone().lerp(explodedOffset, ep);

          const screenVec = currentPos.clone().project(cameraRef.current!);
          const isVisible = screenVec.z < 1.0;
          const x = ((screenVec.x + 1) * rect.width) / 2;
          const y = ((-screenVec.y + 1) * rect.height) / 2;

          return {
            id: annotation.id,
            x,
            y,
            visible: isVisible && x > 20 && x < rect.width - 20 && y > 20 && y < rect.height - 20,
            annotation,
          };
        });
        setProjectedHotspots(projected);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameIdRef.current);
      soundFx.stopAlarmSiren();
      if (motionTimerRef.current) {
        clearInterval(motionTimerRef.current);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, updateLighting]);

  // Dynamically adapt renderer & exposure for Eco Mode
  useEffect(() => {
    if (!rendererRef.current) return;
    if (config.ecoMode) {
      rendererRef.current.setPixelRatio(1.0);
      rendererRef.current.toneMappingExposure = 0.95;
    } else {
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current.toneMappingExposure = 1.25;
    }
  }, [config.ecoMode]);

  // Handle Motion Detection Simulation Trigger
  const handleTriggerMotionSimulation = () => {
    soundFx.playClick();
    if (isMotionSimulating) {
      handleStopAlarm();
      return;
    }

    setIsMotionSimulating(true);
    setAlertSeconds(14);
    if (onConfigChange) {
      onConfigChange({ alarmActive: true, lightingPreset: 'cyber_neon' });
    }

    // Play procedural alarm siren sound loop
    soundFx.startAlarmSiren();

    // Trigger voice alert
    setTimeout(() => {
      soundFx.playVoiceAlert(
        'تنبيه أمني فوري! تم رصد حركة غير معتادة، تم تشغيل صفارة الإنذار والفلاش الضوئي وجاري التسجيل والمتابعة'
      );
    }, 350);

    // Auto-countdown timer
    if (motionTimerRef.current) clearInterval(motionTimerRef.current);
    motionTimerRef.current = window.setInterval(() => {
      setAlertSeconds((prev) => {
        if (prev <= 1) {
          handleStopAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop Alarm & Siren
  const handleStopAlarm = () => {
    soundFx.playClick();
    soundFx.stopAlarmSiren();
    setIsMotionSimulating(false);
    setIsTwoWayTalking(false);
    if (motionTimerRef.current) {
      clearInterval(motionTimerRef.current);
      motionTimerRef.current = null;
    }
    if (onConfigChange) {
      onConfigChange({ alarmActive: false, lightingPreset: 'studio' });
    }
  };

  // Simulate Two-Way Audio Talk
  const handleSimulateTwoWayTalk = () => {
    soundFx.playWalkieTalkieChirp();
    setIsTwoWayTalking(true);
    soundFx.playVoiceAlert('مرحباً! أنت في منطقة مراقبة أمنية مباشرة، يرجى مغادرة المكان فوراً.');
    setTimeout(() => {
      setIsTwoWayTalking(false);
    }, 4500);
  };

  // Update Dynamic Lighting when preset changes
  useEffect(() => {
    if (lightsGroupRef.current) {
      updateLighting(config.lightingPreset, lightsGroupRef.current);
    }
  }, [config.lightingPreset, updateLighting]);

  // Update Materials when Config changes (Color finish, wireframe, glow)
  useEffect(() => {
    if (!partsGroupRef.current) return;

    partsGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          if (child.material.wireframe !== config.isWireframe) {
            child.material.wireframe = config.isWireframe;
          }
        }
      }
    });
  }, [config.material, config.coreGlowColor, config.isWireframe]);

  // Mouse & Touch Drag Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !interactive) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    rotationVelocityRef.current = {
      x: deltaY * 0.001,
      y: deltaX * 0.001,
    };

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    targetDistanceRef.current = Math.max(3.2, Math.min(8.5, targetDistanceRef.current + e.deltaY * 0.003));
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !interactive || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const resetCamera = () => {
    soundFx.playClick();
    targetRotationRef.current = { x: 0.15, y: -0.2 };
    targetDistanceRef.current = 5.4;
  };

  const captureSnapshot = () => {
    soundFx.playSuccess();
    if (rendererRef.current) {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `V380-Pro-Solar-4G-Camera.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full" />

      {/* 3D Projected Hotspot Badges */}
      {interactive &&
        projectedHotspots.map((spot) => {
          if (!spot.visible) return null;
          const isSelected = config.activeHotspotId === spot.id;

          return (
            <div
              key={spot.id}
              style={{
                left: `${spot.x}px`,
                top: `${spot.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 pointer-events-auto transition-transform duration-200"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playBeep();
                  if (onConfigChange) {
                    onConfigChange({ activeHotspotId: isSelected ? null : spot.id });
                  }
                  if (onSelectHotspot) {
                    onSelectHotspot(isSelected ? null : spot.annotation);
                  }
                }}
                className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'w-7 h-7 bg-cyan-400 text-neutral-950 ring-4 ring-cyan-500/40 shadow-xl shadow-cyan-500/50 scale-125'
                    : 'w-6 h-6 bg-neutral-900/90 text-cyan-400 border border-cyan-500/40 hover:scale-110 hover:border-cyan-300 hover:bg-neutral-800'
                }`}
                title={spot.annotation.title}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />

                {/* Technical Tooltip on Hover / Select */}
                <div
                  className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 sm:w-56 p-2.5 rounded-xl bg-neutral-950/95 border border-cyan-500/30 text-right text-xs shadow-2xl backdrop-blur-md transition-all duration-200 pointer-events-none ${
                    isSelected ? 'opacity-100 scale-100 z-30' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}
                >
                  <div className="font-bold text-neutral-100 mb-0.5 text-xs text-cyan-400">{spot.annotation.title}</div>
                  <div className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">{spot.annotation.subtitle}</div>
                </div>
              </button>
            </div>
          );
        })}

      {/* Floating HUD Controls Overlay */}
      {showControlsOverlay && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          
          {/* Top Left Live Status Pill */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-cyan-500/20 backdrop-blur-md text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-neutral-300 font-medium">عرض 3D تفاعلي مباشر (360°)</span>
            <span className="text-neutral-600">|</span>
            <span className="font-mono text-cyan-400 text-[11px]">V380 Pro 4G</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 backdrop-blur-md shadow-lg">
            {/* Motion Detection & Smart Voice Alarm Button */}
            <button
              onClick={handleTriggerMotionSimulation}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isMotionSimulating
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:bg-rose-900/80 hover:text-rose-100'
              }`}
              title="محاكاة كشف الحركة والإنذار الصوتي الذكي"
            >
              <BellRing className={`w-3.5 h-3.5 ${isMotionSimulating ? 'animate-bounce text-white' : 'text-rose-400'}`} />
              <span className="font-bold">
                {isMotionSimulating ? `الإنذار مفعّل (${alertSeconds}s)` : 'محاكاة كشف الحركة'}
              </span>
            </button>

            {/* AR Room View Button */}
            {onOpenAR && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAR();
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-neutral-950 font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
                title="العرض في غرفتك بالواقع المعزز AR"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="font-bold">العرض في غرفتك (AR)</span>
              </button>
            )}

            {/* Exploded Mode Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                if (onConfigChange) {
                  onConfigChange({ isExploded: !config.isExploded });
                }
              }}
              className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                config.isExploded
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
              title="تفكيك المكونات 3D"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تفكيك المكونات</span>
            </button>

            {/* Auto Rotate */}
            <button
              onClick={() => {
                soundFx.playClick();
                if (onConfigChange) {
                  onConfigChange({ autoRotate: !config.autoRotate });
                }
              }}
              className={`p-2 rounded-lg text-xs transition-colors ${
                config.autoRotate ? 'bg-cyan-500/20 text-cyan-400' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
              title="دوران تلقائي 360°"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Wireframe Mode */}
            <button
              onClick={() => {
                soundFx.playClick();
                if (onConfigChange) {
                  onConfigChange({ isWireframe: !config.isWireframe });
                }
              }}
              className={`p-2 rounded-lg text-xs transition-colors ${
                config.isWireframe ? 'bg-cyan-500/20 text-cyan-400' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
              title="مخطط هندسي CAD"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Snapshot */}
            <button
              onClick={captureSnapshot}
              className="p-2 rounded-lg text-xs text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
              title="التقاط صورة بجودة عالية"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Reset Camera */}
            <button
              onClick={resetCamera}
              className="p-2 rounded-lg text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              title="إعادة ضبط زاوية الرؤية"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Interactive Motion & Voice Alarm Simulation Banner */}
      {isMotionSimulating && (
        <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 p-4 rounded-2xl bg-neutral-950/95 border-2 border-rose-500/80 backdrop-blur-xl shadow-2xl shadow-rose-950/80 z-30 pointer-events-auto text-right animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="font-mono text-xs font-black text-rose-400 tracking-wider">
                كشف حركة فوري (PIR Alert)
              </span>
            </div>

            <div className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-600/50 text-[11px] font-mono font-bold text-rose-300">
              {alertSeconds}s
            </div>
          </div>

          <p className="text-xs text-neutral-200 leading-relaxed mb-3 font-medium">
            🚨 تم كشف حركة، دوران العدسة تلقائياً للتتبع، واشتعال صفارة الإنذار 110dB وفلاش بوليسي أحمر وأزرق.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {/* Simulate Two-way Talk */}
            <button
              onClick={handleSimulateTwoWayTalk}
              disabled={isTwoWayTalking}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isTwoWayTalking
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-extrabold animate-pulse'
                  : 'bg-neutral-900 border-cyan-500/40 text-cyan-300 hover:bg-neutral-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isTwoWayTalking ? 'جاري التحدث...' : 'تحدث الآن (مباشر)'}</span>
            </button>

            {/* Stop Siren */}
            <button
              onClick={handleStopAlarm}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-900/80 hover:bg-rose-800 border border-rose-500/60 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>إيقاف الإنذار</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="px-3 py-1 rounded-full bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-400 backdrop-blur-sm shadow-md">
          اسحب بالماوس أو اللمس للتدوير 360° • انقر على النقاط لمعاينة المكونات
        </span>
      </div>
    </div>
  );
};
