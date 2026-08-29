export type SceneMode = 'LIVING_ROOM' | 'ROYAL_MAJLIS' | 'MINIMAL_STUDIO';

export type LightingPreset = 'warm_majlis' | 'daylight_salon' | 'sunset_luxury' | 'evening_mood' | 'emerald_palace';

export type FabricType = 'boucle_italian' | 'velvet_royal' | 'nappa_leather' | 'linen_belgian' | 'chenille_german';
export type WoodFinish = 'american_walnut' | 'natural_oak' | 'smoked_ash' | 'ebony_black';
export type MetalAccent = 'brushed_gold' | 'champagne_bronze' | 'gunmetal_black' | 'chrome_silver';
export type MarbleType = 'calacatta_gold' | 'nero_marquina' | 'travertine_warm' | 'emerald_verde';

export interface MaterialConfig {
  id: string;
  name: string;
  category: 'FABRIC' | 'LEATHER' | 'BOUCLE' | 'VELVET';
  finish: string;
  bodyColor: string;
  accentColor: string;
  woodColor: string;
  metalColor: string;
  texturePattern: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  emissionColor?: string;
  emissionIntensity?: number;
  origin: string;
  durabilityRubCycles: string;
}

export interface HotspotAnnotation {
  id: string;
  title: string;
  subtitle: string;
  category: 'HARDWOOD_FRAME' | 'POCKET_SPRINGS' | 'HR_FOAM_CUSHION' | 'NANO_FABRIC' | 'FEATHER_LAYER' | 'BRASS_FOUNDATION';
  position3D: [number, number, number];
  explodedOffset: [number, number, number];
  description: string;
  specs: { label: string; value: string }[];
}

export interface ProductConfig {
  material: MaterialConfig;
  woodFinish: WoodFinish;
  metalAccent: MetalAccent;
  marbleFinish: MarbleType;
  coreGlowColor: string;
  isExploded: boolean;
  explodedProgress: number; // 0 to 1
  isWireframe: boolean;
  lightingPreset: LightingPreset;
  sceneMode: SceneMode;
  autoRotate: boolean;
  rotationSpeed: number;
  activeHotspotId: string | null;
  cameraPreset: 'front' | 'isometric' | 'top' | 'close_seating' | 'close_armrest' | 'custom';
  performanceMode: 'eco' | 'balanced' | 'ultra';
  engravingText: string;
  sofaConfiguration: '3_seater' | 'modular_l_shape' | 'u_shape_majlis' | 'armchair_set';
  cushionFirmness: 'plush_soft' | 'medium_ergonomic' | 'firm_royal';
  ecoMode?: boolean;
  waterResistanceDemoActive?: boolean;
  arPlaced?: boolean;
  roomWallColor?: string;
  roomFlooring?: 'parquet_oak' | 'marble_italian' | 'beige_carpet';
  withCoffeeTable?: boolean;
  withFloorLamp?: boolean;
  withPillows?: boolean;
  ptzPanAngle?: number;
  ptzTiltAngle?: number;
  alarmActive?: boolean;
}

export interface TechSpecGroup {
  category: string;
  items: { name: string; value: string; highlight?: boolean; detail?: string }[];
}

export type DimosCategory =
  | 'all'
  | 'sofas'
  | 'sectionals'
  | 'recliners'
  | 'compressed'
  | 'living_sets'
  | 'bedrooms'
  | 'dining'
  | 'tables'
  | 'accessories';

export interface DimosProduct {
  id: string;
  sku: string;
  title: string;
  arabicTitle: string;
  englishTitle: string;
  category: DimosCategory;
  categoryNameAr: string;
  subcategory: string;
  price: number; // In SAR
  originalPrice: number;
  discountPercent: number;
  tabbyInstallment: number; // 4 interest-free payments
  rating: number;
  reviewsCount: number;
  badge?: string;
  badgeType?: 'bestseller' | 'discount' | 'new' | 'express' | 'eco';
  image: string;
  gallery: string[];
  dimensions: {
    widthCm: number;
    depthCm: number;
    heightCm: number;
    seatHeightCm?: number;
    formatted: string;
  };
  material: string;
  woodType: string;
  foamDensity: string;
  warrantyYears: number;
  inStock: boolean;
  deliveryTimeDays: string;
  description: string;
  features: string[];
  colors: { id: string; name: string; hex: string }[];
  arModelType: 'modular_sofa' | 'l_shape' | 'u_shape' | 'recliner' | 'armchair' | 'bed' | 'coffee_table' | 'dining_table';
}

export interface CartItem {
  product: DimosProduct;
  quantity: number;
  selectedColor: { id: string; name: string; hex: string };
  selectedFabric?: string;
  customNotes?: string;
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
  price: number; // In SAR
  monthlyEstimate: number; // 4 Tamara/Tabby payments
  deposit: number;
  originalPrice?: number;
  description: string;
  deliveryDate: string;
  features: string[];
  recommended?: boolean;
  gift?: string;
}


