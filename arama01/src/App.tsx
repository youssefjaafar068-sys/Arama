import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from './data/restaurant-data.ts';
import { OrderItem, MenuItem } from './utils/culinary-logic.ts';
import { GoogleMapsSection } from './components/GoogleMapsSection.tsx';
import { VideoAnimatorSection } from './components/VideoAnimatorSection.tsx';
import { ThinkingCulinarySection } from './components/ThinkingCulinarySection.tsx';
import { AsadorGrillSimulator } from './components/AsadorGrillSimulator.tsx';
import { OrderTrayModal } from './components/OrderTrayModal.tsx';
import {
  Flame,
  ShoppingBag,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Wine,
  Utensils,
  Calendar,
  Check,
  Star,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  // Screen navigation state: 'screen1' (Initial Screen: مطعم آراما) or 'screen2' (Arama · Asador)
  const [currentScreen, setCurrentScreen] = useState<'screen1' | 'screen2'>('screen1');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [showQuotaBanner, setShowQuotaBanner] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);

  // Check URL query parameters for testability (?screen=2 or ?screen=asador)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam === '2' || screenParam === 'asador') {
      setCurrentScreen('screen2');
      setLanguage('en');
    }
  }, []);

  // Listen for Google Maps Platform quota event
  useEffect(() => {
    const handleQuota = () => setShowQuotaBanner(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync HTML lang and dir attributes when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleAddToCart = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1, doneness: 'medium_rare' }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setOrderItems((prev) => prev.filter((i) => i.item.id !== itemId));
    } else {
      setOrderItems((prev) =>
        prev.map((i) => (i.item.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleClearOrder = () => setOrderItems([]);

  const filteredMenuItems =
    selectedCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const totalBasketCount = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19] selection:bg-[#7b210d] selection:text-white font-editorial">
      
      {/* Google Maps Quota Warning Banner (Mandatory GMP Case A) */}
      {showQuotaBanner && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#dec0ba]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentScreen('screen1');
                setLanguage('ar');
              }}
              className="flex items-center gap-2.5 text-right cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7b210d] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-[#ffc1b4] animate-pulse" />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-[#1e1b19] block leading-tight">
                  آراما <span className="text-[#7b210d] font-normal font-ledger text-xs">ARAMA</span>
                </span>
                <span className="text-[11px] font-ledger text-[#8a726c] tracking-wider block">
                  مشويات الفحم والفرن الحجري
                </span>
              </div>
            </button>
          </div>

          {/* Prototype Screen Switcher Tabs */}
          <nav className="flex items-center bg-[#f4ece8] p-1 rounded-xl border border-[#dec0ba]">
            <button
              onClick={() => {
                setCurrentScreen('screen1');
                setLanguage('ar');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-ledger font-semibold transition-all ${
                currentScreen === 'screen1'
                  ? 'bg-[#7b210d] text-white shadow-sm'
                  : 'text-[#57423d] hover:text-[#1e1b19]'
              }`}
            >
              1. مطعم آراما (الرئيسية)
            </button>
            <button
              onClick={() => {
                setCurrentScreen('screen2');
                setLanguage('en');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-ledger font-semibold transition-all ${
                currentScreen === 'screen2'
                  ? 'bg-[#7b210d] text-white shadow-sm'
                  : 'text-[#57423d] hover:text-[#1e1b19]'
              }`}
            >
              2. Arama · Asador
            </button>
          </nav>

          {/* Quick Actions (Language & Order Basket) */}
          <div className="flex items-center gap-2.5">
            
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#dec0ba] bg-[#f4ece8] hover:bg-[#e9e1dd] text-xs font-ledger text-[#57423d] transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#7b210d]" />
              <span className="uppercase font-bold">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Feast Tray Basket */}
            <button
              onClick={() => setIsTrayOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#7b210d] hover:bg-[#9b3822] text-white shadow-sm transition flex items-center gap-1.5"
              aria-label="View Feast Tray"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-ledger text-xs font-bold">
                {language === 'ar' ? 'صينية المائدة' : 'Feast Tray'}
              </span>
              {totalBasketCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ffb4a3] text-[#3d0600] font-ledger text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                  {totalBasketCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'screen1' ? (
          /* ========================================================
             SCREEN 1: مطعم آراما · مشويات الفحم والفرن الحجري
             (نسخة تفاعلية متحركة) — Initial Screen
             ======================================================== */
          <div className="space-y-12">
            
            {/* Screen 1 Hero Section with Live Embers & Stone Hearth Status */}
            <section className="relative overflow-hidden bg-[#1e1b19] text-[#fff8f5] py-16 sm:py-24 border-b border-[#dec0ba]/30">
              
              {/* Atmospheric Background Layers */}
              <div className="absolute inset-0 bg-[radial-gradient(#9b3822_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#7b210d]/30 blur-[120px] rounded-full pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Live Hearth Status Pill Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-ledger text-[#dec0ba]">
                  <div className="flex items-center gap-2 bg-[#33302d]/80 px-3 py-1.5 rounded-full border border-[#57423d]">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                    <span>حرارة الفرن الحجري: <strong className="text-white">485°C</strong></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#33302d]/80 px-3 py-1.5 rounded-full border border-[#57423d]">
                    <Flame className="w-3.5 h-3.5 text-[#ffb4a3]" />
                    <span>نوع الحطب: <strong className="text-white">سنديان جبلي + زيتون معمر</strong></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#33302d]/80 px-3 py-1.5 rounded-full border border-[#57423d]">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعتيق اللحوم: <strong className="text-white">45 يوماً جافاً</strong></span>
                  </div>
                </div>

                {/* Hero Title & Subtitle */}
                <div className="text-center max-w-4xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 text-[#ffb4a3] font-display text-xs uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مطعم آراما · أصالة مشويات الجمر والفرن الحجري</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] text-white">
                    مشويات الفحم المتوقد <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdad2] via-[#ffb4a3] to-[#a23d27]">
                      وأطايب الفرن الحجري العتيق
                    </span>
                  </h1>
                  <p className="font-editorial text-lg sm:text-xl text-[#dec0ba] max-w-2xl mx-auto leading-relaxed">
                    من جمر السنديان الأبيض في بيسكاي إلى فخاريات الفرن الحجري المعتّق. نكهة النار الحقيقية، اللحوم الفاخرة المشوية بحرفية، والمقبلات المدخنة بعناية الأجداد.
                  </p>
                </div>

                {/* CTAs & Navigation to Screen 2 */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#menu-section"
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-xl font-display text-xs uppercase tracking-wider font-bold shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Utensils className="w-4 h-4 text-[#ffc1b4]" />
                    <span>استكشاف قائمة المشويات والفرن</span>
                  </a>

                  {/* PROTOTYPE SPEC: Explicit CTA to Screen 2 */}
                  <button
                    onClick={() => {
                      setCurrentScreen('screen2');
                      setLanguage('en');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#fff8f5] hover:bg-[#f4ece8] text-[#1e1b19] rounded-xl font-display text-xs uppercase tracking-wider font-bold shadow-lg transition flex items-center justify-center gap-2 border border-[#dec0ba] cursor-pointer"
                  >
                    <span>الانتقال إلى Arama · Asador (الشاشة الثانية)</span>
                    <ArrowLeft className="w-4 h-4 text-[#7b210d]" />
                  </button>
                </div>

              </div>
            </section>

            {/* Interactive Feature Shortcuts Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
              <div className="bg-[#fff8f5] rounded-2xl border border-[#dec0ba] p-4 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                
                <a
                  href="#video-animator"
                  className="p-4 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] border border-[#dec0ba]/60 transition flex items-center gap-3.5 group"
                >
                  <div className="p-3 bg-[#7b210d] text-white rounded-xl group-hover:scale-105 transition-transform shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#ffc1b4]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#1e1b19]">استوديو حركة النار الحية</h3>
                    <p className="text-xs text-[#57423d] font-editorial">شاهد أطباق الجمر والفرن تنبض بالحياة</p>
                  </div>
                </a>

                <a
                  href="#thinking-sommelier"
                  className="p-4 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] border border-[#dec0ba]/60 transition flex items-center gap-3.5 group"
                >
                  <div className="p-3 bg-[#1e1b19] text-white rounded-xl group-hover:scale-105 transition-transform shadow-xs">
                    <Flame className="w-5 h-5 text-[#ffb4a3]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#1e1b19]">استشارة كبير طهاة آراما</h3>
                    <p className="text-xs text-[#57423d] font-editorial">هندسة الولائم وتوزيع نيران الجمر</p>
                  </div>
                </a>

                <a
                  href="#locations-map"
                  className="p-4 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] border border-[#dec0ba]/60 transition flex items-center gap-3.5 group"
                >
                  <div className="p-3 bg-[#5b614d] text-white rounded-xl group-hover:scale-105 transition-transform shadow-xs">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#1e1b19]">فروع آراما والوصول المباشر</h3>
                    <p className="text-xs text-[#57423d] font-editorial">خريطة الفروع ومسارات الشاطئ والمواقف</p>
                  </div>
                </a>

              </div>
            </section>

            {/* Menu Section */}
            <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="font-ledger text-xs text-[#7b210d] uppercase tracking-wider block mb-1">
                    أطايب النار والفرن
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1e1b19]">
                    قائمة مشويات الفحم والفرن الحجري
                  </h2>
                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'الكل (جميع الأطباق)' },
                    { id: 'grill', label: 'مشويات الجمر' },
                    { id: 'hearth', label: 'الفرن الحجري والفخار' },
                    { id: 'mezze', label: 'المقبلات المدخنة' },
                    { id: 'drinks', label: 'المشروبات والسيدرا' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-ledger transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#7b210d] text-white shadow'
                          : 'bg-[#f4ece8] text-[#57423d] hover:bg-[#e9e1dd] border border-[#dec0ba]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#fff8f5] rounded-xl border border-[#dec0ba] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                  >
                    <div className="relative h-52 overflow-hidden bg-[#1e1b19]">
                      <img
                        src={item.image}
                        alt={item.nameAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#1e1b19]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-ledger font-bold">
                        ${item.price}
                      </div>
                      {item.isHouseSpecialty && (
                        <div className="absolute top-3 right-3 bg-[#7b210d] text-white px-2.5 py-1 rounded text-[10px] font-ledger uppercase font-bold flex items-center gap-1 shadow">
                          <Flame className="w-3 h-3 text-[#ffc1b4]" />
                          <span>توقيع آراما</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-ledger text-[#8a726c] mb-1">
                          <span className="uppercase">{item.woodType.replace('_', ' ')} Embers</span>
                          {item.weightGrams && <span>{item.weightGrams}g</span>}
                        </div>
                        <h3 className="font-display font-bold text-lg text-[#1e1b19] mb-1">
                          {item.nameAr}
                        </h3>
                        <p className="font-editorial text-xs text-[#57423d] leading-relaxed line-clamp-3">
                          {item.descriptionAr}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#dec0ba]/60 flex items-center justify-between">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-2 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#ffc1b4]" />
                          <span>إضافة إلى صينية المائدة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* Ember & Grill Simulator Integration on Screen 1 */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <AsadorGrillSimulator language={language} />
            </section>

            {/* Feature 1: Video Animator Section */}
            <VideoAnimatorSection language={language} />

            {/* Feature 2: High Thinking Mode Section */}
            <ThinkingCulinarySection language={language} />

            {/* Feature 3: Google Maps Platform Section */}
            <GoogleMapsSection language={language} />

            {/* Bottom Screen Navigation Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="bg-gradient-to-r from-[#1e1b19] to-[#33302d] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#57423d]">
                <div className="space-y-2 text-center md:text-right">
                  <span className="font-ledger text-xs text-[#ffb4a3] uppercase tracking-widest block">
                    TRANSITION TO SCREEN 2
                  </span>
                  <h3 className="font-display text-3xl font-bold">
                    تجربة أزادور الباسكية العريقة: Arama · Asador
                  </h3>
                  <p className="font-editorial text-[#dec0ba] text-sm max-w-xl">
                    استكشف طقوس الـ Txotx الباسكية وسكب السيدرا من براميل البلوط، وتقطيع شرائح الشوليتون على ألواح خشب السنديان.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentScreen('screen2');
                    setLanguage('en');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-xl font-ledger text-sm uppercase tracking-wider font-bold shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>الدخول إلى Arama · Asador</span>
                  <ArrowLeft className="w-4 h-4 text-[#ffc1b4]" />
                </button>
              </div>
            </section>

          </div>
        ) : (
          /* ========================================================
             SCREEN 2: Arama · Asador
             (Basque Gastronomic & Ciderhouse Experience)
             ======================================================== */
          <div className="space-y-12">
            
            {/* Screen 2 Hero: Basque Txotx & Hearth */}
            <section className="relative overflow-hidden bg-[#fff8f5] py-16 sm:py-24 border-b border-[#dec0ba]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back to Screen 1 Navigation Pill */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setCurrentScreen('screen1');
                      setLanguage('ar');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-ledger text-[#7b210d] hover:text-[#9b3822] bg-[#f4ece8] px-3.5 py-2 rounded-lg border border-[#dec0ba] transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← Return to Screen 1 (مطعم آراما · مشويات الفحم والفرن الحجري)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: Editorial Story & Brand System */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5b614d]/10 text-[#5b614d] rounded-full text-xs font-ledger uppercase tracking-wider">
                      <Wine className="w-3.5 h-3.5" />
                      <span>SAGARDOTEGI & ASADOR TRADITION · GIPUZKOA</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-display font-semibold text-[#1e1b19] leading-[1.1]">
                      Arama · Asador <br />
                      <span className="text-[#7b210d] italic font-normal">
                        Txotx & Live Hearth
                      </span>
                    </h1>

                    <p className="font-editorial text-lg text-[#57423d] leading-relaxed">
                      Nestled into the salt-misted cliffs above the Bay of Biscay, Arama Asador balances raw agricultural austerity with the visceral warmth of hand-hewn oak barrels and furious charcoal embers.
                    </p>

                    {/* Ledger notes */}
                    <div className="p-4 bg-[#f4ece8] rounded-xl border border-[#dec0ba] space-y-2 text-xs font-ledger text-[#57423d]">
                      <div className="flex justify-between border-b border-[#dec0ba]/60 pb-1.5">
                        <span className="uppercase text-[#8a726c]">The Txotx Ritual:</span>
                        <span className="font-bold text-[#1e1b19]">Wild-fermented cider poured from height</span>
                      </div>
                      <div className="flex justify-between border-b border-[#dec0ba]/60 pb-1.5">
                        <span className="uppercase text-[#8a726c]">Cut of Choice:</span>
                        <span className="font-bold text-[#7b210d]">Txuleta de Vaca Vieja (45-day dry aged)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="uppercase text-[#8a726c]">Fuel & Hearth:</span>
                        <span className="font-bold text-[#1e1b19]">Ancient Holm Oak & Stone Hearth (485°C)</span>
                      </div>
                    </div>

                    {/* Screen 2 Quick Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href="#asador-simulator"
                        className="px-6 py-3 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-bold transition shadow"
                      >
                        Parrilla Heat Simulator
                      </a>
                      <a
                        href="#reservation-section"
                        className="px-6 py-3 bg-[#1e1b19] hover:bg-[#33302d] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-bold transition"
                      >
                        Reserve Hearth Table
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Featured Cut Showcase Card */}
                  <div className="lg:col-span-5 bg-[#faf2ee] p-6 rounded-2xl border border-[#dec0ba] shadow-lg space-y-4">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#1e1b19]">
                      <img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
                        alt="Basque Txuleta Ribeye"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#7b210d] text-white px-3 py-1 rounded text-xs font-ledger font-bold">
                        Signature Txuleta 1kg
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-xl text-[#1e1b19]">
                          Basque Ribeye on Holm Oak
                        </h3>
                        <span className="font-ledger text-lg font-bold text-[#7b210d]">$88</span>
                      </div>
                      <p className="text-xs text-[#57423d] font-editorial leading-relaxed">
                        Sourced from mature grass-fed Galician cattle, dry-aged for six weeks in cold salt cellars, then dropped over white-hot embers to develop an intense caramelized bark.
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(MENU_ITEMS[0])}
                      className="w-full py-2.5 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Txuleta to Feast Basket</span>
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* Interactive Asador Simulator Section */}
            <section id="asador-simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <AsadorGrillSimulator language={language} />
            </section>

            {/* Table Reservation & Degustation Form */}
            <section id="reservation-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-[#fff8f5] rounded-2xl border border-[#dec0ba] p-6 sm:p-10 shadow-sm">
                <div className="max-w-2xl mx-auto text-center mb-8">
                  <div className="inline-flex items-center gap-1.5 text-[#7b210d] font-ledger text-xs uppercase tracking-widest mb-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>ASADOR TABLE BOOKING</span>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-[#1e1b19]">
                    Reserve Your Hearthside Degustation
                  </h2>
                  <p className="text-sm text-[#57423d] font-editorial mt-1">
                    Direct seating along the open hearth grill. Witness the Basque parrillero flame mastery and cider tap ritual.
                  </p>
                </div>

                {reservationSubmitted ? (
                  <div className="p-8 bg-[#faf2ee] rounded-xl text-center space-y-3 max-w-md mx-auto border border-[#dec0ba]">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#1e1b19]">
                      Hearthside Table Confirmed
                    </h3>
                    <p className="text-xs text-[#57423d] font-editorial">
                      Your wood-fired degustation has been scheduled. The coals will be stoked for your arrival.
                    </p>
                    <button
                      onClick={() => setReservationSubmitted(false)}
                      className="mt-2 text-xs font-ledger text-[#7b210d] underline"
                    >
                      Make another reservation
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setReservationSubmitted(true);
                    }}
                    className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                        Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mateo Jauregi"
                        className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-lg p-2.5 text-xs text-[#1e1b19] font-editorial focus:outline-none focus:border-[#7b210d]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                        Date & Service:
                      </label>
                      <input
                        type="date"
                        required
                        defaultValue="2026-11-15"
                        className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-lg p-2.5 text-xs text-[#1e1b19] font-ledger focus:outline-none focus:border-[#7b210d]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                        Number of Guests:
                      </label>
                      <select className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-lg p-2.5 text-xs text-[#1e1b19] font-ledger focus:outline-none focus:border-[#7b210d]">
                        <option>2 Guests (Hearth Counter)</option>
                        <option>4 Guests (Oak Barrel Table)</option>
                        <option>6 Guests (Parrillero Table)</option>
                        <option>10+ Guests (Sagardotegi Feast)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                        Selected Branch:
                      </label>
                      <select className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-lg p-2.5 text-xs text-[#1e1b19] font-ledger focus:outline-none focus:border-[#7b210d]">
                        <option>San Sebastián Flagship Asador (Gipuzkoa)</option>
                        <option>Beirut Coastal Stone Hearth</option>
                        <option>Dubai Palm Hearth & Embers</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-xl font-ledger text-xs uppercase tracking-wider font-bold shadow transition"
                      >
                        Confirm Hearth Reservation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* AI Video Animator Section on Screen 2 */}
            <VideoAnimatorSection language={language} />

            {/* High Thinking Section on Screen 2 */}
            <ThinkingCulinarySection language={language} />

            {/* Google Maps Section on Screen 2 */}
            <GoogleMapsSection language={language} />

            {/* Screen 2 Footer Banner to navigate back to Screen 1 */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-[#f4ece8] rounded-xl p-6 border border-[#dec0ba] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-[#1e1b19]">
                    Ready to return to the Levantine Hearth & Stone Oven edition?
                  </h4>
                  <p className="font-editorial text-xs text-[#57423d]">
                    Switch back to Screen 1: مطعم آراما · مشويات الفحم والفرن الحجري.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentScreen('screen1');
                    setLanguage('ar');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Screen 1</span>
                </button>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Feast Tray Modal */}
      <OrderTrayModal
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearOrder={handleClearOrder}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-[#1e1b19] text-[#dec0ba] border-t border-[#57423d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7b210d] flex items-center justify-center text-white">
                  <Flame className="w-4 h-4 text-[#ffc1b4]" />
                </div>
                <span className="font-display font-bold text-lg text-white">آراما · ARAMA</span>
              </div>
              <p className="text-xs font-editorial text-[#dec0ba] leading-relaxed">
                مشويات الفحم الحجري وأزادور الباسك. اتحاد عريق بين نيران السنديان والفرن الحجري العتيق.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-ledger text-xs text-[#ffb4a3] uppercase block">
                {language === 'ar' ? 'التنقل بين الشاشات' : 'Screen Navigation'}
              </span>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => { setCurrentScreen('screen1'); setLanguage('ar'); }}
                    className="hover:text-white transition"
                  >
                    1. مطعم آراما · مشويات الفحم (Initial Screen)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setCurrentScreen('screen2'); setLanguage('en'); }}
                    className="hover:text-white transition"
                  >
                    2. Arama · Asador (Screen 2)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-display font-bold text-xs text-[#ffb4a3] uppercase block">
                {language === 'ar' ? 'أصول مشويات الجمر' : 'The Hearth Philosophy'}
              </span>
              <ul className="space-y-1.5 text-xs text-[#dec0ba] font-editorial">
                <li>{language === 'ar' ? 'حطب السنديان المعمر والزيتون' : 'Holm Oak & Olive Firewood'}</li>
                <li>{language === 'ar' ? 'تعتيق اللحوم الجاف 45 يوماً' : '45-Day Dry Aged Prime Cuts'}</li>
                <li>{language === 'ar' ? 'فخاريات الفرن الحجري المعتّقة' : 'Artisanal Clay Hearth Vessels'}</li>
                <li>{language === 'ar' ? 'طقوس سكب السيدرا الباسكية (Txotx)' : 'The Txotx Cider Pour Ritual'}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-ledger text-xs text-[#ffb4a3] uppercase block">
                {language === 'ar' ? 'الفروع وساعات العمل' : 'Locations & Hours'}
              </span>
              <p className="text-xs">San Sebastián · Beirut · Dubai</p>
              <p className="text-[11px] font-ledger text-[#8a726c]">12:30 PM – 11:30 PM Daily</p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#57423d] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a726c] font-ledger">
            <span>© 2026 Arama Restaurant & Asador. All rights reserved.</span>
            <span>Txotx & Hearth Artisanal Design System</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
