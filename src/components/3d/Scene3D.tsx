import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ProductConfig, HotspotAnnotation } from '../../types';
import { HOTSPOT_ANNOTATIONS, WOOD_FINISH_OPTIONS, METAL_ACCENT_OPTIONS, MARBLE_FINISH_OPTIONS } from '../../data/productData';
import { soundFx } from '../../utils/audio';
import {
  Maximize2,
  RotateCcw,
  Box,
  Eye,
  Camera,
  Sparkles,
  Droplets,
  Layers,
  CheckCircle2,
  Grid,
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

  // Mesh part references for exploded view & animation
  const partsRef = useRef<{
    sofaBaseGroup?: THREE.Group;
    seatCushionsGroup?: THREE.Group;
    backrestsGroup?: THREE.Group;
    armrestsGroup?: THREE.Group;
    throwPillowsGroup?: THREE.Group;
    pocketSpringsGroup?: THREE.Group;
    hrFoamLayerGroup?: THREE.Group;
    woodPlinthMesh?: THREE.Mesh;
    metalTrimMesh?: THREE.Mesh;
    coffeeTableGroup?: THREE.Group;
    floorLampGroup?: THREE.Group;
    waterDropletsGroup?: THREE.Group;
  }>({});

  // Dynamic hotspot 2D screen coordinates
  const [projectedHotspots, setProjectedHotspots] = useState<
    { id: string; x: number; y: number; visible: boolean; annotation: HotspotAnnotation }[]
  >([]);

  // Orbit & Mouse Interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.002 });
  const targetRotationRef = useRef({ x: 0.22, y: -0.35 });
  const currentRotationRef = useRef({ x: 0.22, y: -0.35 });
  const targetDistanceRef = useRef(5.2);
  const currentDistanceRef = useRef(5.2);
  const explodedProgressLerpRef = useRef(0);
  const animationFrameIdRef = useRef<number>(0);

  // Lighting updater based on Saudi salon / majlis presets
  const updateLighting = useCallback((preset: ProductConfig['lightingPreset'], lightsGroup: THREE.Group) => {
    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.9);
    lightsGroup.add(ambientLight);

    if (preset === 'warm_majlis') {
      // Warm golden luxury chandeliers
      const mainWarm = new THREE.DirectionalLight(0xffeedd, 2.8);
      mainWarm.position.set(5, 8, 6);
      const warmBounce = new THREE.PointLight(0xd4af37, 2.5, 18);
      warmBounce.position.set(0, 4, 3);
      const rimLight = new THREE.DirectionalLight(0xffcca0, 1.2);
      rimLight.position.set(-6, 3, -4);
      lightsGroup.add(mainWarm, warmBounce, rimLight);
    } else if (preset === 'daylight_salon') {
      // Bright natural daylight from floor-to-ceiling windows
      const sunKey = new THREE.DirectionalLight(0xffffff, 3.2);
      sunKey.position.set(8, 10, 5);
      const skyFill = new THREE.DirectionalLight(0xe0f2fe, 1.4);
      skyFill.position.set(-7, 5, -3);
      const groundBounce = new THREE.PointLight(0xfef3c7, 1.6, 20);
      groundBounce.position.set(0, -3, 4);
      lightsGroup.add(sunKey, skyFill, groundBounce);
    } else if (preset === 'sunset_luxury') {
      // Warm amber Riyadh sunset vibes
      const sunKey = new THREE.DirectionalLight(0xff9933, 3.4);
      sunKey.position.set(7, 4, 5);
      const purpleRim = new THREE.PointLight(0xa855f7, 1.8, 16);
      purpleRim.position.set(-5, 3, -4);
      lightsGroup.add(sunKey, purpleRim);
    } else if (preset === 'evening_mood') {
      ambientLight.intensity = 0.45;
      const spotKey = new THREE.SpotLight(0xffeedd, 4.2, 25, Math.PI / 4, 0.4);
      spotKey.position.set(3, 7, 5);
      const lampGlow = new THREE.PointLight(0xffb84d, 3.5, 12);
      lampGlow.position.set(-2.5, 2.8, 1.5);
      lightsGroup.add(spotKey, lampGlow);
    } else if (preset === 'emerald_palace') {
      const emeraldGlow = new THREE.PointLight(0x10b981, 2.0, 15);
      emeraldGlow.position.set(-4, 3, 2);
      const goldKey = new THREE.DirectionalLight(0xfef08a, 2.6);
      goldKey.position.set(5, 7, 5);
      lightsGroup.add(emeraldGlow, goldKey);
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
    scene.fog = new THREE.FogExp2(0x0c0b0a, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.2);
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
    renderer.toneMappingExposure = 1.2;
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

    // Luxury Salon Floor Plinth
    const floorGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.15, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181614,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle Gold Grid Ring on Floor
    const gridRingGeo = new THREE.RingGeometry(2.4, 3.8, 48);
    const gridRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const gridRing = new THREE.Mesh(gridRingGeo, gridRingMat);
    gridRing.rotation.x = Math.PI / 2;
    gridRing.position.y = -1.12;
    scene.add(gridRing);

    // Master Parts Group
    const masterPartsGroup = new THREE.Group();
    scene.add(masterPartsGroup);
    partsGroupRef.current = masterPartsGroup;

    // -------------------------------------------------------------
    // BUILD 3D SOFA & LUXURY LIVING ROOM MODEL (DIMOSS SOVEREIGN)
    // -------------------------------------------------------------

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.material.bodyColor),
      metalness: config.material.metalness,
      roughness: config.material.roughness,
      wireframe: config.isWireframe,
    });

    const accentCushionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.material.accentColor),
      metalness: config.material.metalness * 0.8,
      roughness: Math.min(0.95, config.material.roughness + 0.1),
      wireframe: config.isWireframe,
    });

    const woodObj = WOOD_FINISH_OPTIONS.find((w) => w.id === config.woodFinish) || WOOD_FINISH_OPTIONS[0];
    const woodMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(woodObj.color),
      roughness: 0.45,
      metalness: 0.1,
      wireframe: config.isWireframe,
    });

    const metalObj = METAL_ACCENT_OPTIONS.find((m) => m.id === config.metalAccent) || METAL_ACCENT_OPTIONS[0];
    const metalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(metalObj.color),
      roughness: 0.22,
      metalness: 0.9,
      wireframe: config.isWireframe,
    });

    const marbleObj = MARBLE_FINISH_OPTIONS.find((m) => m.id === config.marbleFinish) || MARBLE_FINISH_OPTIONS[0];
    const marbleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(marbleObj.color),
      roughness: 0.12,
      metalness: 0.15,
      wireframe: config.isWireframe,
    });

    // 1. BASE STRUCTURE GROUP (Hardwood frame + Titanium Gold plinth & legs)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -0.75, 0);

    // Hardwood Solid Plinth
    const plinthGeo = new THREE.BoxGeometry(3.6, 0.18, 1.4);
    const plinthMesh = new THREE.Mesh(plinthGeo, woodMat);
    baseGroup.add(plinthMesh);
    partsRef.current.woodPlinthMesh = plinthMesh;

    // Metallic Rim Trim
    const metalTrimGeo = new THREE.BoxGeometry(3.64, 0.06, 1.44);
    const metalTrimMesh = new THREE.Mesh(metalTrimGeo, metalMat);
    metalTrimMesh.position.y = -0.06;
    baseGroup.add(metalTrimMesh);
    partsRef.current.metalTrimMesh = metalTrimMesh;

    // 6x Cylindrical Gold Titanium Feet
    const footGeo = new THREE.CylinderGeometry(0.045, 0.03, 0.22, 24);
    const footPositions = [
      [-1.65, -0.2, 0.55],
      [1.65, -0.2, 0.55],
      [-1.65, -0.2, -0.55],
      [1.65, -0.2, -0.55],
      [0, -0.2, 0.55],
      [0, -0.2, -0.55],
    ];

    footPositions.forEach(([fx, fy, fz]) => {
      const foot = new THREE.Mesh(footGeo, metalMat);
      foot.position.set(fx, fy, fz);
      baseGroup.add(foot);
    });

    masterPartsGroup.add(baseGroup);
    partsRef.current.sofaBaseGroup = baseGroup;

    // 2. POCKET SPRING MATRIX & SUSPENSION (Internal layer shown during exploded view)
    const springsGroup = new THREE.Group();
    springsGroup.position.set(0, -0.45, 0);

    const springCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: true,
    });

    for (let row = -1; row <= 1; row++) {
      for (let col = -4; col <= 4; col++) {
        const springGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12);
        const springMesh = new THREE.Mesh(springGeo, springCoilMat);
        springMesh.position.set(col * 0.38, 0, row * 0.38);
        springsGroup.add(springMesh);
      }
    }
    masterPartsGroup.add(springsGroup);
    partsRef.current.pocketSpringsGroup = springsGroup;

    // 3. HR 45D MEMORY FOAM LAYER (Visible in exploded view)
    const hrFoamGroup = new THREE.Group();
    hrFoamGroup.position.set(0, -0.25, 0);
    const hrFoamMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const foamBlockGeo = new THREE.BoxGeometry(3.5, 0.22, 1.3);
    const foamBlockMesh = new THREE.Mesh(foamBlockGeo, hrFoamMat);
    hrFoamGroup.add(foamBlockMesh);
    masterPartsGroup.add(hrFoamGroup);
    partsRef.current.hrFoamLayerGroup = hrFoamGroup;

    // 4. SEATING CUSHIONS (3 Modular Deep Cushions with beveled softness)
    const cushionsGroup = new THREE.Group();
    cushionsGroup.position.set(0, -0.3, 0.08);

    const cushionGeo = new THREE.BoxGeometry(1.12, 0.38, 1.15);
    const cushionOffsets = [-1.18, 0, 1.18];

    cushionOffsets.forEach((cx) => {
      const seat = new THREE.Mesh(cushionGeo, bodyMat);
      seat.position.set(cx, 0, 0);

      // Top soft stitching piping
      const seamGeo = new THREE.TorusGeometry(0.54, 0.015, 12, 32);
      const seamMesh = new THREE.Mesh(seamGeo, accentCushionMat);
      seamMesh.rotation.x = Math.PI / 2;
      seamMesh.position.set(cx, 0.19, 0);
      cushionsGroup.add(seamMesh);

      cushionsGroup.add(seat);
    });

    masterPartsGroup.add(cushionsGroup);
    partsRef.current.seatCushionsGroup = cushionsGroup;

    // 5. BACKREST & PLUSH BACK CUSHIONS
    const backrestsGroup = new THREE.Group();
    backrestsGroup.position.set(0, 0.25, -0.45);

    // Main structural back frame
    const backFrameGeo = new THREE.BoxGeometry(3.5, 0.72, 0.35);
    const backFrameMesh = new THREE.Mesh(backFrameGeo, bodyMat);
    backrestsGroup.add(backFrameMesh);

    // 3x Ergonomic Slanted Back Cushions
    const backCushionGeo = new THREE.BoxGeometry(1.1, 0.62, 0.28);
    cushionOffsets.forEach((bx) => {
      const backCush = new THREE.Mesh(backCushionGeo, bodyMat);
      backCush.position.set(bx, 0.05, 0.2);
      backCush.rotation.x = -0.18; // Comfortable ergonomic tilt
      backrestsGroup.add(backCush);
    });

    masterPartsGroup.add(backrestsGroup);
    partsRef.current.backrestsGroup = backrestsGroup;

    // 6. ERGONOMIC ARMRESTS (Left & Right)
    const armrestsGroup = new THREE.Group();
    armrestsGroup.position.set(0, 0.05, 0);

    const armGeo = new THREE.BoxGeometry(0.32, 0.58, 1.35);

    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-1.86, 0, 0);
    armrestsGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.set(1.86, 0, 0);
    armrestsGroup.add(rightArm);

    masterPartsGroup.add(armrestsGroup);
    partsRef.current.armrestsGroup = armrestsGroup;

    // 7. THROW PILLOWS & ACCENT CUSHIONS
    const pillowsGroup = new THREE.Group();
    pillowsGroup.position.set(0, 0.05, 0.2);

    const pillowGeo = new THREE.BoxGeometry(0.48, 0.48, 0.18);

    const p1 = new THREE.Mesh(pillowGeo, accentCushionMat);
    p1.position.set(-1.45, 0.1, -0.15);
    p1.rotation.set(-0.2, 0.35, -0.1);
    pillowsGroup.add(p1);

    const p2 = new THREE.Mesh(pillowGeo, accentCushionMat);
    p2.position.set(1.45, 0.1, -0.15);
    p2.rotation.set(-0.2, -0.35, 0.1);
    pillowsGroup.add(p2);

    const pCenter = new THREE.Mesh(pillowGeo, accentCushionMat);
    pCenter.position.set(0.4, 0.05, -0.18);
    pCenter.rotation.set(-0.15, -0.1, 0);
    pillowsGroup.add(pCenter);

    masterPartsGroup.add(pillowsGroup);
    partsRef.current.throwPillowsGroup = pillowsGroup;

    // 8. COFFEE TABLE (Calacatta Gold / Nero Marquina Marble + Brushed Brass Base)
    const coffeeTableGroup = new THREE.Group();
    coffeeTableGroup.position.set(0, -0.72, 1.35);

    // Marble Top
    const tableTopGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.06, 48);
    const tableTopMesh = new THREE.Mesh(tableTopGeo, marbleMat);
    coffeeTableGroup.add(tableTopMesh);

    // Brass Plinth & Base
    const tableBaseGeo = new THREE.CylinderGeometry(0.45, 0.52, 0.38, 36);
    const tableBaseMesh = new THREE.Mesh(tableBaseGeo, metalMat);
    tableBaseMesh.position.y = -0.22;
    coffeeTableGroup.add(tableBaseMesh);

    // Decorative Fragrance Diffuser / Arabic Coffee Cup on table
    const cupGeo = new THREE.CylinderGeometry(0.06, 0.045, 0.09, 24);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupMesh.position.set(0.18, 0.075, 0.1);
    coffeeTableGroup.add(cupMesh);

    masterPartsGroup.add(coffeeTableGroup);
    partsRef.current.coffeeTableGroup = coffeeTableGroup;

    // 9. FLOOR LAMP WITH COZY GLOW
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2.4, -0.15, -0.6);

    const lampPoleGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 16);
    const lampPole = new THREE.Mesh(lampPoleGeo, metalMat);
    lampGroup.add(lampPole);

    const lampShadeGeo = new THREE.ConeGeometry(0.35, 0.45, 24, 1, true);
    const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0xfff8ee, roughness: 0.3, side: THREE.DoubleSide });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.position.y = 1.05;
    lampGroup.add(lampShade);

    const lampGlow = new THREE.PointLight(0xffeedd, 1.8, 6);
    lampGlow.position.y = 0.95;
    lampGroup.add(lampGlow);

    masterPartsGroup.add(lampGroup);
    partsRef.current.floorLampGroup = lampGroup;

    // 10. NANO WATER RESISTANCE SIMULATION (Liquid beads bouncing off the surface)
    const dropletsGroup = new THREE.Group();
    dropletsGroup.position.set(0.6, 0.1, 0.25);
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.9,
      roughness: 0.05,
      ior: 1.33,
      reflectivity: 0.9,
    });

    for (let d = 0; d < 8; d++) {
      const dropGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const dropMesh = new THREE.Mesh(dropGeo, dropMat);
      dropMesh.position.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.4);
      dropletsGroup.add(dropMesh);
    }
    masterPartsGroup.add(dropletsGroup);
    partsRef.current.waterDropletsGroup = dropletsGroup;

    // -------------------------------------------------------------
    // RENDER LOOP & 3D ANIMATIONS
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Orbit Controls Lerp
      if (!isDraggingRef.current) {
        if (config.autoRotate) {
          targetRotationRef.current.y += 0.006 * config.rotationSpeed;
        } else {
          targetRotationRef.current.y += rotationVelocityRef.current.y;
          targetRotationRef.current.x += rotationVelocityRef.current.x;
          rotationVelocityRef.current.y *= 0.92;
          rotationVelocityRef.current.x *= 0.92;
        }
      }

      // Clamp vertical pitch rotation
      targetRotationRef.current.x = Math.max(-0.2, Math.min(0.65, targetRotationRef.current.x));

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * 0.1;

      // Apply camera orbital position
      if (cameraRef.current) {
        const dist = currentDistanceRef.current;
        const rx = currentRotationRef.current.x;
        const ry = currentRotationRef.current.y;

        cameraRef.current.position.x = dist * Math.sin(ry) * Math.cos(rx);
        cameraRef.current.position.y = 0.4 + dist * Math.sin(rx);
        cameraRef.current.position.z = dist * Math.cos(ry) * Math.cos(rx);
        cameraRef.current.lookAt(0, -0.1, 0);
      }

      // Exploded View Lerping
      const targetExplode = config.isExploded ? (config.explodedProgress > 0 ? config.explodedProgress : 1) : 0;
      explodedProgressLerpRef.current += (targetExplode - explodedProgressLerpRef.current) * 0.08;
      const ep = explodedProgressLerpRef.current;

      // Explode individual part positions smoothly
      if (partsRef.current.sofaBaseGroup) {
        partsRef.current.sofaBaseGroup.position.y = -0.75 - ep * 0.9;
      }
      if (partsRef.current.pocketSpringsGroup) {
        partsRef.current.pocketSpringsGroup.position.y = -0.45 - ep * 0.4;
        partsRef.current.pocketSpringsGroup.visible = ep > 0.05;
      }
      if (partsRef.current.hrFoamLayerGroup) {
        partsRef.current.hrFoamLayerGroup.position.y = -0.25 + ep * 0.3;
        partsRef.current.hrFoamLayerGroup.visible = ep > 0.05;
      }
      if (partsRef.current.seatCushionsGroup) {
        partsRef.current.seatCushionsGroup.position.set(0, -0.3 + ep * 0.9, 0.08 + ep * 0.4);
      }
      if (partsRef.current.backrestsGroup) {
        partsRef.current.backrestsGroup.position.set(0, 0.25 + ep * 0.8, -0.45 - ep * 0.7);
      }
      if (partsRef.current.armrestsGroup) {
        if (partsRef.current.armrestsGroup.children[0]) {
          partsRef.current.armrestsGroup.children[0].position.x = -1.86 - ep * 0.8;
        }
        if (partsRef.current.armrestsGroup.children[1]) {
          partsRef.current.armrestsGroup.children[1].position.x = 1.86 + ep * 0.8;
        }
      }
      if (partsRef.current.throwPillowsGroup) {
        partsRef.current.throwPillowsGroup.position.set(0, 0.05 + ep * 1.3, 0.2 + ep * 0.5);
      }
      if (partsRef.current.coffeeTableGroup) {
        partsRef.current.coffeeTableGroup.position.set(0, -0.72, 1.35 + ep * 0.9);
      }

      // Water droplet floating effect
      if (partsRef.current.waterDropletsGroup) {
        partsRef.current.waterDropletsGroup.position.y = 0.1 + Math.sin(time * 3) * 0.03;
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
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, updateLighting, config.woodFinish, config.metalAccent, config.marbleFinish]);

  // Update Dynamic Lighting when preset changes
  useEffect(() => {
    if (lightsGroupRef.current) {
      updateLighting(config.lightingPreset, lightsGroupRef.current);
    }
  }, [config.lightingPreset, updateLighting]);

  // Update Materials when Config changes (Color finish, wireframe)
  useEffect(() => {
    if (!partsGroupRef.current) return;

    const newBodyColor = new THREE.Color(config.material.bodyColor);
    const newAccentColor = new THREE.Color(config.material.accentColor);

    if (partsRef.current.seatCushionsGroup) {
      partsRef.current.seatCushionsGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color = newBodyColor;
          child.material.metalness = config.material.metalness;
          child.material.roughness = config.material.roughness;
          child.material.wireframe = config.isWireframe;
        }
      });
    }

    if (partsRef.current.backrestsGroup) {
      partsRef.current.backrestsGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color = newBodyColor;
          child.material.metalness = config.material.metalness;
          child.material.roughness = config.material.roughness;
          child.material.wireframe = config.isWireframe;
        }
      });
    }

    if (partsRef.current.armrestsGroup) {
      partsRef.current.armrestsGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color = newBodyColor;
          child.material.metalness = config.material.metalness;
          child.material.roughness = config.material.roughness;
          child.material.wireframe = config.isWireframe;
        }
      });
    }

    if (partsRef.current.throwPillowsGroup) {
      partsRef.current.throwPillowsGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color = newAccentColor;
          child.material.wireframe = config.isWireframe;
        }
      });
    }

    // Wood & Metal finish updates
    const woodObj = WOOD_FINISH_OPTIONS.find((w) => w.id === config.woodFinish);
    if (woodObj && partsRef.current.woodPlinthMesh) {
      (partsRef.current.woodPlinthMesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(woodObj.color);
    }

    const metalObj = METAL_ACCENT_OPTIONS.find((m) => m.id === config.metalAccent);
    if (metalObj && partsRef.current.metalTrimMesh) {
      (partsRef.current.metalTrimMesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(metalObj.color);
    }
  }, [config.material, config.isWireframe, config.woodFinish, config.metalAccent]);

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

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x += deltaY * 0.007;

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
    targetDistanceRef.current = Math.max(3.0, Math.min(8.0, targetDistanceRef.current + e.deltaY * 0.003));
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

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x += deltaY * 0.007;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const resetCamera = () => {
    soundFx.playClick();
    targetRotationRef.current = { x: 0.22, y: -0.35 };
    targetDistanceRef.current = 5.2;
  };

  const captureSnapshot = () => {
    soundFx.playCameraShutter();
    if (rendererRef.current) {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Dimoss-Saudi-Luxury-Living.png`;
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
                    ? 'w-8 h-8 bg-amber-400 text-neutral-950 ring-4 ring-amber-500/40 shadow-xl shadow-amber-500/50 scale-125'
                    : 'w-6 h-6 bg-neutral-950/90 text-amber-400 border border-amber-500/50 hover:scale-110 hover:border-amber-300 hover:bg-neutral-900'
                }`}
                title={spot.annotation.title}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />

                {/* Technical Tooltip on Hover / Select */}
                <div
                  className={`absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 rounded-2xl bg-neutral-950/95 border border-amber-500/40 text-right text-xs shadow-2xl backdrop-blur-md transition-all duration-200 pointer-events-none ${
                    isSelected ? 'opacity-100 scale-100 z-30' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}
                >
                  <div className="font-extrabold text-amber-400 mb-1 text-xs">{spot.annotation.title}</div>
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
          <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-neutral-950/80 border border-amber-500/30 backdrop-blur-md text-xs shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-neutral-200 font-bold">معاينة ثلاثية الأبعاد 360°</span>
            <span className="text-neutral-600">|</span>
            <span className="font-sans text-amber-400 font-extrabold text-[11px]">DIMOSS SOVEREIGN</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-800 backdrop-blur-md shadow-xl">
            
            {/* AR Room View Button */}
            {onOpenAR && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAR();
                }}
                className="px-3 py-1.5 rounded-xl text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
                title="العرض في غرفتك ومجلسك بالواقع المعزز AR"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="font-bold">العرض في صالتك (AR)</span>
              </button>
            )}

            {/* Exploded Mode Toggle */}
            <button
              onClick={() => {
                soundFx.playExplodeToggle(!config.isExploded);
                if (onConfigChange) {
                  onConfigChange({ isExploded: !config.isExploded });
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                config.isExploded
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
              title="تفكيك الطبقات الهندسية (الخشب، النوابض، الاسفنج)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">تفكيك الطبقات</span>
            </button>

            {/* Auto Rotate */}
            <button
              onClick={() => {
                soundFx.playClick();
                if (onConfigChange) {
                  onConfigChange({ autoRotate: !config.autoRotate });
                }
              }}
              className={`p-2 rounded-xl text-xs transition-colors ${
                config.autoRotate ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
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
              className={`p-2 rounded-xl text-xs transition-colors ${
                config.isWireframe ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
              title="مخطط هندسي CAD"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Snapshot */}
            <button
              onClick={captureSnapshot}
              className="p-2 rounded-xl text-xs text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
              title="التقاط صورة لتصميمك"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Reset Camera */}
            <button
              onClick={resetCamera}
              className="p-2 rounded-xl text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              title="إعادة ضبط زاوية الرؤية"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Bottom Interactive Prompt */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="px-4 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800/80 text-[11px] text-neutral-300 backdrop-blur-md shadow-lg">
          اسحب بالماوس أو اللمس للتدوير 360° • اضغط على النقاط الذهبية لمعاينة خامات الهيكل والاسفنج
        </span>
      </div>
    </div>
  );
};
