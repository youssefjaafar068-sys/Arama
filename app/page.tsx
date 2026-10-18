'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuCard } from '../components/MenuCard';
import { CartDrawer } from '../components/CartDrawer';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { categories } from '../data/mockData';
import { Search, Utensils } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Zustand Store
  const {
    menuItems,
    cartItems,
    addToCart,
  } = useAppStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartCount = isMounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Sticky Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAdminMode={false} // Will be moved to admin dashboard
        onToggleAdminMode={() => {}} 
      />

      {/* Hero Section */}
      <Hero onViewMenu={() => handleNavigate('menu')} />

      {/* Main Menu Section */}
      <div id="menu" className="py-16 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Title & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right w-full md:w-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                المنيو
              </h2>
              <p className="text-slate-500 text-sm mt-2">كل اللي تحت ينطبخ اليوم. اختر ودوس إضافة.</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="ابحث عن طبقك المفضّل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-arama-500 focus:ring-2 focus:ring-arama-500/20 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Category Filtering Tabs */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Most ordered strip — breaks the grid monotony */}
          {activeCategory === 'all' && !searchQuery && (() => {
            const top = menuItems.filter((m) => m.badge === 'الأكثر مبيعاً').slice(0, 3);
            if (top.length === 0) return null;
            return (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-amber-400 text-xs font-bold">الناس وش تطلب؟</p>
                    <h3 className="text-xl font-black mt-1">الأكثر مبيعاً عندنا</h3>
                  </div>
                  <button
                    onClick={() => setActiveCategory('grills')}
                    className="text-xs font-bold text-slate-300 underline underline-offset-8 decoration-slate-600 hover:text-white shrink-0"
                  >
                    شوف المشويات
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  {top.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => addToCart(t)}
                      className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-right transition-colors"
                    >
                      <img src={t.image} alt={t.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{t.name}</p>
                        <p className="text-amber-400 font-black text-sm mt-0.5">{t.price} ر.س <span className="text-slate-400 font-medium text-[11px]">· دوس للسلة</span></p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">لا توجد نتائج مطابقة لبحثك</h3>
              <p className="text-sm text-slate-500">جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من المنيو.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-2.5 rounded-xl bg-arama-500 text-white font-bold text-sm hover:bg-arama-600 transition-colors shadow-md"
              >
                عرض كل أصناف المنيو
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  isAdminMode={false} // Will be moved to admin dashboard
                  onUpdateImage={() => {}}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

    </div>
  );
}
