export type SceneMode = 'PRODUCT_CORE' | 'NEBULA_SPACE' | 'CYBER_KINETIC';

export type LightingPreset = 'studio' | 'cyber_neon' | 'sunset_amber' | 'deep_void' | 'emerald_matrix';

export interface MaterialConfig {
  id: string;
  name: string;
  finish: 'titanium' | 'chrome' | 'obsidian' | 'rosegold' | 'cyber' | 'frost';
  bodyColor: string;
  accentColor: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  emissionColor: string;
  emissionIntensity: number;
}

export interface HotspotAnnotation {
  id: string;
  title: string;
  subtitle: string;
  category: 'SOLAR_POWER' | 'OPTICS_DUAL' | 'PTZ_MOTOR' | 'SIM_CONNECTIVITY' | 'AI_SECURITY' | 'BATTERY_CELL';
  position3D: [number, number, number];
  explodedOffset: [number, number, number];
  description: string;
  specs: { label: string; value: string }[];
}

export interface ProductConfig {
  material: MaterialConfig;
  coreGlowColor: string;
  isExploded: boolean;
  explodedProgress: number; // 0 to 1
  isWireframe: boolean;
  lightingPreset: LightingPreset;
  sceneMode: SceneMode;
  autoRotate: boolean;
  rotationSpeed: number;
  activeHotspotId: string | null;
  cameraPreset: 'front' | 'isometric' | 'top' | 'close_core' | 'close_optics' | 'custom';
  performanceMode: 'eco' | 'balanced' | 'ultra';
  engravingText: string;
  alarmActive?: boolean;
  nightVisionMode?: 'smart_color' | 'infrared' | 'full_color';
  ptzPanAngle?: number;
  ptzTiltAngle?: number;
  ptzZoom?: number;
  floodlightActive?: boolean;
  twoWayTalkActive?: boolean;
  ptzAutoCruise?: boolean;
  ecoMode?: boolean;
}

export interface TechSpecGroup {
  category: string;
  items: { name: string; value: string; highlight?: boolean; detail?: string }[];
}

export interface BenchmarkData {
  metric: string;
  auraValue: number;
  industryAverage: number;
  unit: string;
  description: string;
  advantageMultiplier: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  monthlyEstimate: number;
  deposit: number;
  originalPrice?: number;
  description: string;
  deliveryDate: string;
  features: string[];
  recommended?: boolean;
  gift?: string;
}

