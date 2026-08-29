import React, { useState, useMemo } from 'react';
import { DimosProduct, DimosCategory, ProductConfig } from '../types';
import { OFFICIAL_DIMOS_CATEGORIES, OFFICIAL_DIMOS_PRODUCTS } from '../data/dimosStoreData';
import { DimossLogo } from './DimossLogo';
import { soundFx } from '../utils/audio';
import {
  Search,
  Sparkles,
  Layers,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
  Crown,
  Check,
  Truck,
  ShieldCheck,
  Star,
  Maximize2,
  Scan,
  CreditCard,
  ChevronRight,
  Info,
  Calendar,
  X,
  Share2,
} from 'lucide-react';

interface DimosStoreCatalogProps {
  onOpenARWithProduct: (product: DimosProduct) => void;
  onOpenCustomizerWithProduct: (product: DimosProduct) => void;
  onOpenReservationWithProduct: (product: DimosProduct) => void;
}

export const DimosStoreCatalog: React.FC<DimosStoreCatalogProps> = ({
  onOpenARWithProduct,
  onOpenCustomizerWithProduct,
  onOpenReservationWithProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DimosCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'bestseller' | 'price_asc' | 'price_desc' | 'rating'>('bestseller');
  const [selectedProductDetails, setSelectedProductDetails] = useState<DimosProduct | null>(null);
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return OFFICIAL_DIMOS_PRODUCTS.filter((prod) => {
      const matchCat = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.arabicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleColorSelect = (productId: string, colorIdx: number) => {
    soundFx.playFabricSwatch();
    setSelectedColors((prev) => ({ ...prev, [productId]: colorIdx }));
  };

  const handleOpenDetails = (prod: DimosProduct) => {
    soundFx.playClick();
    setSelectedProductDetails(prod);
    setActiveGalleryIndex(0);
  };

  return (
    <section id="dimos-catalog-section" className="relative py-20 bg-neutral-950 text-neutral-100 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-1 rounded-xl bg-white/95 border border-neutral-200 shadow-md">
              <DimossLogo variant="full" size="sm" />
            </div>
            <span className="px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-xs font-black text-red-300">
              متجر ديموس الرسمي • المملكة العربية السعودية 🇸🇦
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight leading-tight">
            أقسام ومنتجات مفروشات ديموس
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            تصفح أحدث مجموعات الكنب الإيطالي، كنب الزاوية، أريكة الاسترخاء والكنب المضغوط وغرف النوم مع إمكانية تجربة أي قطعة فورياً في غرفتك بتقنية <strong className="text-amber-300">الواقع المعزز AR ثلاثي الأبعاد</strong>.
          </p>

          {/* Quick Value Props Banner */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>توصيل وتركيب مجاني لكافة المدن</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ضمان ذهبي معتمد 10 سنوات</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>تقسيط تابي وتمارا على 4 دفعات 0% فوائد</span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {OFFICIAL_DIMOS_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40 border border-red-500'
                      : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-850 border border-neutral-800'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.nameAr}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {cat.id === 'all' ? OFFICIAL_DIMOS_PRODUCTS.length : OFFICIAL_DIMOS_PRODUCTS.filter((p) => p.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن كنب، زاوية، ريكلاينر، سرير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-neutral-400 shrink-0">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-200 focus:outline-none focus:border-red-500"
              >
                <option value="bestseller">الأكثر طلباً ومبيعاً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="rating">أعلى تقييم للعملاء</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <p className="text-base font-bold text-neutral-300">لم يتم العثور على منتجات مطابقة للبحث</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              عرض جميع منتجات ديموس
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => {
              const activeColorIndex = selectedColors[prod.id] || 0;
              const currentColor = prod.colors[activeColorIndex] || prod.colors[0];

              return (
                <div
                  key={prod.id}
                  className="group relative rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 hover:border-red-500/50 shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-red-950/20"
                >
                  {/* Badge */}
                  {prod.badge && (
                    <div className="absolute top-3.5 right-3.5 z-20">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-red-600/90 text-white border border-red-400/40 shadow-lg backdrop-blur-md">
                        {prod.badge}
                      </span>
                    </div>
                  )}

                  {/* AR Direct Icon Launcher */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenARWithProduct(prod);
                    }}
                    className="absolute top-3.5 left-3.5 z-20 p-2 rounded-xl bg-neutral-950/80 hover:bg-red-600 text-neutral-200 hover:text-white border border-neutral-700 hover:border-red-400 shadow-xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-[11px] font-bold"
                    title="معاينة المنتج في غرفتك بالواقع المعزز AR"
                  >
                    <Scan className="w-4 h-4 text-amber-400 group-hover/ar:text-white" />
                    <span>جرب في غرفتك AR</span>
                  </button>

                  {/* Product Image Stage */}
                  <div
                    onClick={() => handleOpenDetails(prod)}
                    className="relative w-full h-64 sm:h-72 overflow-hidden bg-neutral-900 cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.arabicTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                    {/* Dimensions Overlay Tag */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-950/85 border border-neutral-700/60 text-[11px] font-medium text-neutral-300 backdrop-blur-md">
                        📏 {prod.dimensions.widthCm} × {prod.dimensions.depthCm} × {prod.dimensions.heightCm} سم
                      </span>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-amber-400 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating}</span>
                        <span className="text-neutral-400">({prod.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="text-red-400 font-bold">{prod.categoryNameAr}</span>
                        <span className="font-mono text-[11px] text-neutral-500">كود: {prod.sku}</span>
                      </div>

                      <h3
                        onClick={() => handleOpenDetails(prod)}
                        className="text-base sm:text-lg font-black text-neutral-100 group-hover:text-red-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {prod.title}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Color Swatches */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">اللون المختار:</span>
                        <span className="text-neutral-200 font-bold">{currentColor.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {prod.colors.map((c, idx) => (
                          <button
                            key={c.id}
                            onClick={() => handleColorSelect(prod.id, idx)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              activeColorIndex === idx
                                ? 'border-red-500 scale-110 shadow-md ring-2 ring-red-500/30'
                                : 'border-neutral-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price & Installments */}
                    <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-neutral-100">
                              {prod.price.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-neutral-400">ر.س</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-neutral-500 line-through">
                                {prod.originalPrice.toLocaleString()} ر.س
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold">
                            شامل ضريبة القيمة المضافة 15%
                          </div>
                        </div>

                        {prod.discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-800 text-[11px] font-black">
                            وفر {prod.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Tabby & Tamara Installment Banner */}
                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>أو <strong>{Math.round(prod.tabbyInstallment)} ر.س</strong> / شهر (4 دفعات)</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                          تابي / تمارا
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      
                      {/* AR Room Button */}
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onOpenARWithProduct(prod);
                        }}
                        className="w-full py-2.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700 active:scale-95"
                      >
                        <Scan className="w-3.5 h-3.5 text-amber-400" />
                        <span>واقع معزز AR</span>
                      </button>

                      {/* Reserve & Order Button */}
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onOpenReservationWithProduct(prod);
                        }}
                        className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-md shadow-red-900/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>طلب وحجز فوري</span>
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white/95 border border-neutral-200">
                  <DimossLogo variant="full" size="sm" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-100">
                    {selectedProductDetails.title}
                  </h3>
                  <span className="text-xs text-red-400">{selectedProductDetails.categoryNameAr}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Gallery */}
                <div className="space-y-3">
                  <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img
                      src={selectedProductDetails.gallery[activeGalleryIndex] || selectedProductDetails.image}
                      alt={selectedProductDetails.arabicTitle}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        const p = selectedProductDetails;
                        setSelectedProductDetails(null);
                        onOpenARWithProduct(p);
                      }}
                      className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-red-600/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                    >
                      <Scan className="w-4 h-4 text-amber-300" />
                      <span>معاينة في غرفتك AR</span>
                    </button>
                  </div>

                  {selectedProductDetails.gallery.length > 1 && (
                    <div className="flex items-center gap-2">
                      {selectedProductDetails.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                            activeGalleryIndex === idx ? 'border-red-500 scale-105' : 'border-neutral-800 opacity-60'
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specs & Pricing */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-neutral-100">
                        {selectedProductDetails.price.toLocaleString()} ر.س
                      </span>
                      {selectedProductDetails.originalPrice > selectedProductDetails.price && (
                        <span className="text-sm text-neutral-500 line-through">
                          {selectedProductDetails.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {selectedProductDetails.description}
                    </p>
                  </div>

                  {/* Dimension card */}
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
                    <span className="text-neutral-400 block font-bold">المقاسات الهندسية المعتمدة:</span>
                    <p className="text-amber-400 font-bold">{selectedProductDetails.dimensions.formatted}</p>
                  </div>

                  {/* Materials card */}
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">نوع القماش والخامة:</span>
                      <span className="text-neutral-200 font-bold">{selectedProductDetails.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">هيكل الخشب الداخلي:</span>
                      <span className="text-neutral-200 font-bold">{selectedProductDetails.woodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">كثافة الإسفنج:</span>
                      <span className="text-neutral-200 font-bold">{selectedProductDetails.foamDensity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">الضمان المعتمد:</span>
                      <span className="text-amber-400 font-bold">{selectedProductDetails.warrantyYears} سنوات ضمان ذهبي</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-neutral-400 font-bold">أبرز المميزات:</span>
                    <ul className="space-y-1">
                      {selectedProductDetails.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 sm:p-6 border-t border-neutral-800 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-neutral-400 text-center sm:text-right">
                <span>جاهز للشحن والتوصيل خلال <strong>{selectedProductDetails.deliveryTimeDays}</strong></span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const p = selectedProductDetails;
                    setSelectedProductDetails(null);
                    onOpenARWithProduct(p);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700"
                >
                  <Scan className="w-4 h-4 text-amber-400" />
                  <span>معاينة AR في غرفتك</span>
                </button>

                <button
                  onClick={() => {
                    const p = selectedProductDetails;
                    setSelectedProductDetails(null);
                    onOpenReservationWithProduct(p);
                  }}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-black text-xs shadow-lg shadow-red-900/40 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>تأكيد الحجز وتفصيل الطلب</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
