import * as THREE from 'three';
import { ProductConfig } from '../types';

export interface Camera3DModelInstance {
  group: THREE.Group;
  parts: {
    solarPanelGroup: THREE.Group;
    fixedLensGroup: THREE.Group;
    ptzDomeGroup: THREE.Group;
    ptzInnerSphere: THREE.Group;
    antennasGroup: THREE.Group;
    batteryGroup: THREE.Group;
    wallBracketGroup: THREE.Group;
    alarmStrobeLeft?: THREE.PointLight;
    alarmStrobeRight?: THREE.PointLight;
    floodlightGroup?: THREE.Group;
  };
  materials: {
    bodyMat: THREE.MeshStandardMaterial;
    darkTrimMat: THREE.MeshStandardMaterial;
    lensGlassMat: THREE.MeshPhysicalMaterial;
    glowLedMat: THREE.MeshStandardMaterial;
    solarCellMat: THREE.MeshStandardMaterial;
    solarFrameMat: THREE.MeshStandardMaterial;
  };
  updateConfig: (config: ProductConfig) => void;
  updatePTZ: (pan: number, tilt: number) => void;
  setAlarm: (active: boolean) => void;
  setExploded: (progress: number) => void;
}

export function buildCamera3DModel(config: ProductConfig): Camera3DModelInstance {
  const masterGroup = new THREE.Group();

  // Materials
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
  solarGroup.rotation.x = -0.42;

  const solarBaseGeo = new THREE.BoxGeometry(2.8, 0.08, 1.8);
  const solarBaseMesh = new THREE.Mesh(solarBaseGeo, solarFrameMat);
  solarBaseMesh.castShadow = true;
  solarBaseMesh.receiveShadow = true;
  solarGroup.add(solarBaseMesh);

  const solarGridGeo = new THREE.PlaneGeometry(2.68, 1.68);
  const solarGridMesh = new THREE.Mesh(solarGridGeo, solarCellMat);
  solarGridMesh.rotation.x = -Math.PI / 2;
  solarGridMesh.position.y = 0.045;
  solarGroup.add(solarGridMesh);

  // Solar panel sub-lines / texture simulation
  const lineMat = new THREE.LineBasicMaterial({ color: 0x475569 });
  for (let i = -1.2; i <= 1.2; i += 0.4) {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i, 0.05, -0.8),
      new THREE.Vector3(i, 0.05, 0.8),
    ]);
    const line = new THREE.Line(lineGeo, lineMat);
    solarGroup.add(line);
  }

  const solarArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16);
  const solarArmMesh = new THREE.Mesh(solarArmGeo, darkTrimMat);
  solarArmMesh.position.set(0, -0.3, -0.2);
  solarArmMesh.rotation.x = 0.5;
  solarGroup.add(solarArmMesh);

  masterGroup.add(solarGroup);

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

  const cardSlotCoverGeo = new THREE.BoxGeometry(0.06, 0.22, 0.28);
  const cardSlotCoverMesh = new THREE.Mesh(cardSlotCoverGeo, darkTrimMat);
  cardSlotCoverMesh.position.set(0.2, 0, 0.35);
  bracketGroup.add(cardSlotCoverMesh);

  masterGroup.add(bracketGroup);

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

  masterGroup.add(antennasGroup);

  // 4. INTEGRATED BATTERY & TOP HOUSING
  const batteryGroup = new THREE.Group();
  batteryGroup.position.set(0, 0.75, 0);

  const topHousingGeo = new THREE.CylinderGeometry(0.55, 0.62, 0.65, 32);
  const topHousingMesh = new THREE.Mesh(topHousingGeo, bodyMat);
  batteryGroup.add(topHousingMesh);

  const ringGeo = new THREE.TorusGeometry(0.58, 0.025, 16, 48);
  const ringMesh = new THREE.Mesh(ringGeo, glowLedMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = -0.1;
  batteryGroup.add(ringMesh);

  masterGroup.add(batteryGroup);

  // 5. UPPER MODULE - FIXED LENS CAMERA
  const fixedLensGroup = new THREE.Group();
  fixedLensGroup.position.set(0, 0.35, 0.25);

  const fixedBodyGeo = new THREE.BoxGeometry(0.95, 0.75, 0.7);
  const fixedBodyMesh = new THREE.Mesh(fixedBodyGeo, bodyMat);
  fixedLensGroup.add(fixedBodyMesh);

  const fixedLensBezelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 32);
  const fixedLensBezelMesh = new THREE.Mesh(fixedLensBezelGeo, darkTrimMat);
  fixedLensBezelMesh.rotation.x = Math.PI / 2;
  fixedLensBezelMesh.position.set(0, 0.05, 0.36);
  fixedLensGroup.add(fixedLensBezelMesh);

  const fixedLensGlassGeo = new THREE.SphereGeometry(0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const fixedLensGlassMesh = new THREE.Mesh(fixedLensGlassGeo, lensGlassMat);
  fixedLensGlassMesh.rotation.x = Math.PI / 2;
  fixedLensGlassMesh.position.set(0, 0.05, 0.4);
  fixedLensGroup.add(fixedLensGlassMesh);

  // Fixed Module 6x White Floodlight LEDs
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const ledGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16);
    const ledMesh = new THREE.Mesh(ledGeo, glowLedMat);
    ledMesh.rotation.x = Math.PI / 2;
    ledMesh.position.set(Math.cos(angle) * 0.32, 0.05 + Math.sin(angle) * 0.24, 0.36);
    fixedLensGroup.add(ledMesh);
  }

  masterGroup.add(fixedLensGroup);

  // 6. LOWER MODULE - 360° PTZ ROTATING DOME CAMERA
  const ptzDomeGroup = new THREE.Group();
  ptzDomeGroup.position.set(0, -0.65, 0.1);

  const forkBaseGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
  const forkBaseMesh = new THREE.Mesh(forkBaseGeo, darkTrimMat);
  forkBaseMesh.position.y = 0.35;
  ptzDomeGroup.add(forkBaseMesh);

  const ptzInnerSphere = new THREE.Group();
  ptzDomeGroup.add(ptzInnerSphere);

  const sphereDomeGeo = new THREE.SphereGeometry(0.56, 32, 32);
  const sphereDomeMesh = new THREE.Mesh(sphereDomeGeo, bodyMat);
  ptzInnerSphere.add(sphereDomeMesh);

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

  // 8x LEDs around PTZ lens
  for (let j = 0; j < 8; j++) {
    const angle = (j / 8) * Math.PI * 2;
    const r = 0.38;
    const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16);
    const isWhite = j % 2 === 0;
    const ledMat = isWhite
      ? glowLedMat
      : new THREE.MeshStandardMaterial({
          color: 0x9333ea,
          emissive: 0x9333ea,
          emissiveIntensity: 2.0,
        });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.rotation.x = Math.PI / 2;
    ledMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.44);
    ptzInnerSphere.add(ledMesh);
  }

  // PIR Motion Sensor
  const pirGeo = new THREE.SphereGeometry(0.12, 20, 20);
  const pirMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
  });
  const pirMesh = new THREE.Mesh(pirGeo, pirMat);
  pirMesh.position.set(0, -0.46, 0.32);
  ptzInnerSphere.add(pirMesh);

  // Siren Alarm Flasher Left & Right (Police Red/Blue)
  const redFlasherGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
  const redFlasherMat = new THREE.MeshStandardMaterial({
    color: 0xff0033,
    emissive: 0xff0033,
    emissiveIntensity: config.alarmActive ? 4.0 : 0.8,
  });
  const redFlasherMesh = new THREE.Mesh(redFlasherGeo, redFlasherMat);
  redFlasherMesh.position.set(-0.4, 0.28, 0.36);
  ptzDomeGroup.add(redFlasherMesh);

  const blueFlasherGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
  const blueFlasherMat = new THREE.MeshStandardMaterial({
    color: 0x0055ff,
    emissive: 0x0055ff,
    emissiveIntensity: config.alarmActive ? 4.0 : 0.8,
  });
  const blueFlasherMesh = new THREE.Mesh(blueFlasherGeo, blueFlasherMat);
  blueFlasherMesh.position.set(0.4, 0.28, 0.36);
  ptzDomeGroup.add(blueFlasherMesh);

  // Strobe PointLights for Alarm
  const redStrobe = new THREE.PointLight(0xff0033, config.alarmActive ? 3.5 : 0, 5);
  redStrobe.position.set(-0.5, 0.3, 0.5);
  ptzDomeGroup.add(redStrobe);

  const blueStrobe = new THREE.PointLight(0x0066ff, config.alarmActive ? 3.5 : 0, 5);
  blueStrobe.position.set(0.5, 0.3, 0.5);
  ptzDomeGroup.add(blueStrobe);

  masterGroup.add(ptzDomeGroup);

  // Helper functions
  const updateConfig = (newConfig: ProductConfig) => {
    bodyMat.color.set(newConfig.material.bodyColor);
    bodyMat.metalness = newConfig.material.metalness;
    bodyMat.roughness = newConfig.material.roughness;
    bodyMat.wireframe = newConfig.isWireframe;

    glowLedMat.color.set(newConfig.coreGlowColor);
    glowLedMat.emissive.set(newConfig.coreGlowColor);
    glowLedMat.wireframe = newConfig.isWireframe;

    darkTrimMat.wireframe = newConfig.isWireframe;
    lensGlassMat.wireframe = newConfig.isWireframe;
    solarCellMat.wireframe = newConfig.isWireframe;
    solarFrameMat.wireframe = newConfig.isWireframe;

    const alarmOn = !!newConfig.alarmActive;
    redFlasherMat.emissiveIntensity = alarmOn ? 4.0 : 0.8;
    blueFlasherMat.emissiveIntensity = alarmOn ? 4.0 : 0.8;
    redStrobe.intensity = alarmOn ? 3.5 : 0;
    blueStrobe.intensity = alarmOn ? 3.5 : 0;
  };

  const updatePTZ = (pan: number, tilt: number) => {
    ptzDomeGroup.rotation.y = pan;
    ptzInnerSphere.rotation.x = tilt;
  };

  const setAlarm = (active: boolean) => {
    redFlasherMat.emissiveIntensity = active ? 4.0 : 0.8;
    blueFlasherMat.emissiveIntensity = active ? 4.0 : 0.8;
    redStrobe.intensity = active ? 3.5 : 0;
    blueStrobe.intensity = active ? 3.5 : 0;
  };

  const setExploded = (progress: number) => {
    solarGroup.position.set(0, 1.75 + progress * 1.6, -0.3 + progress * -0.4);
    bracketGroup.position.set(0, 0.4, -0.75 + progress * -1.2);
    antennasGroup.position.set(0, 0.7 + progress * 0.8, -0.4 + progress * -0.6);
    batteryGroup.position.set(0, 0.75 + progress * 0.9, 0);
    fixedLensGroup.position.set(0, 0.35 + progress * 0.4, 0.25 + progress * 0.9);
    ptzDomeGroup.position.set(0, -0.65 + progress * -1.2, 0.1 + progress * 0.6);
  };

  return {
    group: masterGroup,
    parts: {
      solarPanelGroup: solarGroup,
      fixedLensGroup,
      ptzDomeGroup,
      ptzInnerSphere,
      antennasGroup,
      batteryGroup,
      wallBracketGroup: bracketGroup,
      alarmStrobeLeft: redStrobe,
      alarmStrobeRight: blueStrobe,
    },
    materials: {
      bodyMat,
      darkTrimMat,
      lensGlassMat,
      glowLedMat,
      solarCellMat,
      solarFrameMat,
    },
    updateConfig,
    updatePTZ,
    setAlarm,
    setExploded,
  };
}
