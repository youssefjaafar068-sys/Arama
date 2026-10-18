import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Phone, UtensilsCrossed, MapPin, Settings } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenLocationCheck?: () => void;
  customerDistrict?: string | null;
  isInsideZone?: boolean | null;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  onOpenLocationCheck,
  customerDistrict,
  isInsideZone,
  isAdminMode,
  onToggleAdminMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'الرئيسية' },
    { id: 'menu', label: 'المنيو' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-arama-600 to-arama-400 flex items-center justify-center text-white shadow-lg shadow-arama-500/30">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                آراما <span className="text-arama-500 font-light text-xl">| Arama</span>
              </span>
              <p className="text-xs text-slate-500 font-medium">{restaurantInfo.city} • مشويات ومأكولات</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeSection === link.id
                    ? 'bg-arama-500 text-white shadow-md shadow-arama-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Admin Image Upload Mode Toggle Button — hidden from customers */}
            <button
              onClick={onToggleAdminMode}
              className={`hidden items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
                isAdminMode
                  ? 'bg-amber-500 border-amber-600 text-white shadow-amber-500/30 animate-pulse'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-arama-400 hover:text-arama-600'
              }`}
              title="تفعيل وضع تعديل الصور بكلمة المرور"
              style={{ display: 'none' }}
            >
              <Settings className={`w-4 h-4 ${isAdminMode ? 'animate-spin' : ''}`} />
              <span>{isAdminMode ? 'وضع التعديل مفعل' : 'وضع التعديل'}</span>
            </button>

            {onOpenLocationCheck && (
              <button
                onClick={onOpenLocationCheck}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  customerDistrict
                    ? isInsideZone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-arama-50 border-arama-300 text-arama-700 hover:bg-arama-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-arama-600" />
                <span>{customerDistrict ? `موقعك: ${customerDistrict}` : 'حدد موقعك'}</span>
              </button>
            )}

            <a
              href={`tel:${restaurantInfo.phone}`}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-bold"
            >
              <Phone className="w-4 h-4 text-arama-400" />
              <span>دق واطلب</span>
            </a>

            {/* Shopping Cart Button with Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-3 rounded-2xl bg-arama-500 text-white hover:bg-arama-600 transition-all shadow-lg shadow-arama-500/30 flex items-center justify-center group active:scale-95"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-6 px-6 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {onOpenLocationCheck && (
              <button
                onClick={() => {
                  onOpenLocationCheck();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-arama-50 text-arama-800 border border-arama-200 font-bold text-sm shadow-sm"
              >
                <MapPin className="w-4 h-4 text-arama-600" />
                <span>{customerDistrict ? `موقعك: ${customerDistrict}` : 'حدد موقعك للتحقق من التوصيل'}</span>
              </button>
            )}

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-right px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  activeSection === link.id
                    ? 'bg-arama-500 text-white shadow-md shadow-arama-500/25'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onToggleAdminMode();
                setMobileMenuOpen(false);
              }}
              className="hidden items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700"
              style={{ display: 'none' }}
            >
              <Settings className="w-4 h-4" />
              <span>{isAdminMode ? 'إلغاء وضع التعديل' : 'وضع التعديل (كلمة المرور)'}</span>
            </button>

            <a
              href={`tel:${restaurantInfo.phone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-arama-500 text-white font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>دق علينا واطلب ({restaurantInfo.phone})</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
