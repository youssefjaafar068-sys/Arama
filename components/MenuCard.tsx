import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Flame, Clock, Check, Upload, Image as ImageIcon } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  isAdminMode?: boolean;
  onUpdateImage?: (itemId: string, newImage: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  isAdminMode,
  onUpdateImage,
}) => {
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);

  // Sync state if item.image changes from props
  React.useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  const handleAdd = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImgSrc(result);
        if (onUpdateImage) {
          onUpdateImage(item.id, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={item.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

        {/* Popular Badge */}
        {item.isPopular && !isAdminMode && (
          <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>الأكثر طلباً</span>
          </span>
        )}

        {/* Admin Image Upload Overlay Button */}
        {isAdminMode ? (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
            <label className="cursor-pointer bg-arama-500 hover:bg-arama-600 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95">
              <Upload className="w-4 h-4" />
              <span>رفع صورة جديدة للطبق</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-slate-300 text-[10px] mt-2">اختر صورة واضحة من جهازك</span>
          </div>
        ) : (
          /* Price Tag in Image Corner */
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-white/20">
            <span className="text-arama-600 font-black text-lg">
              {item.price} <span className="text-xs font-bold text-slate-600">ر.س</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-arama-600 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed font-light">
            {item.description}
          </p>
        </div>

        {/* Meta Info (Calories & Prep Time) */}
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
          {item.calories && (
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-arama-400" />
              <span>{item.calories} سعرة حرارية</span>
            </div>
          )}
          {item.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.preparationTime}</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={isAdminMode}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            isAdminMode
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-arama-500 hover:bg-arama-600 text-white shadow-arama-500/25'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5 animate-bounce" />
              <span>تمت الإضافة بنجاح</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>إضافة إلى السلة</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
