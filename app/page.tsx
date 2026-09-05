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
import { categories, menuItems as initialMenuItems } from '../data/mockData';
import { CartItem, MenuItem, OrderType } from '../types';
import { Search, Utensils, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // Admin Image Upload Mode State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load cart & custom menu images from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('arama_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    const savedMenu = localStorage.getItem('arama_custom_menu');
    if (savedMenu) {
      try {
        setMenuItems(JSON.parse(savedMenu));
      } catch (e) {
        console.error('Failed to parse custom menu', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('arama_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save custom menu to localStorage when updated
  const handleUpdateItemImage = (itemId: string, newImage: string) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, image: newImage } : item
      );
      localStorage.setItem('arama_custom_menu', JSON.stringify(updated));
      return updated;
    });

    setSuccessToast('تم تحديث صورة الطبق وحفظها بنجاح!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevItems, { item, quantity: 1, notes: '' }];
      }
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleUpdateNotes = (index: number, notes: string) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].notes = notes;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

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

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Sticky Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
      />

      {/* Hero Section */}
      <Hero onViewMenu={() => handleNavigate('menu')} />

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-subtle">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-bold text-sm">{successToast}</span>
        </div>
      )}

      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="bg-amber-500 text-slate-950 py-3 px-4 text-center font-bold text-sm sticky top-20 z-30 shadow-md flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5" />
          <span>وضع تعديل الصور مفعل حالياً: يمكنك النقر على زر "رفع صورة جديدة للطبق" على أي بطاقة لتغيير صورتها بصورة من جهازك مباشرة!</span>
          <button
            onClick={() => setIsAdminMode(false)}
            className="mr-4 px-3 py-1 rounded-xl bg-slate-950 text-white text-xs hover:bg-slate-800"
          >
            إنهاء التعديل
          </button>
        </div>
      )}

      {/* Main Menu Section */}
      <div id="menu" className="py-16 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Title & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right w-full md:w-auto">
              <span className="text-arama-600 font-bold text-sm bg-arama-100 px-3.5 py-1 rounded-xl">
                قائمة الطعام الطازجة
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                اختر ما تُفضله من المنيو
              </h2>
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
                  onAddToCart={handleAddToCart}
                  isAdminMode={isAdminMode}
                  onUpdateImage={handleUpdateItemImage}
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
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateNotes={handleUpdateNotes}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
