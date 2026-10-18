import React from 'react';
import { Star, Clock, MapPin, Phone, ArrowLeft, Navigation } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

interface HeroProps {
  onViewMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewMenu }) => {
  const handleGetDirections = () => {
    window.open('https://maps.google.com/?q=Hafar+Al-Batin+Arama+Restaurant', '_blank');
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-arama-950 text-white overflow-hidden py-20 lg:py-28">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-arama-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Status & Rating Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {restaurantInfo.status}
              </span>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{restaurantInfo.rating}</span>
                <span className="text-slate-400">· {restaurantInfo.reviewCount.toLocaleString('ar-SA')} تقييم على قوقل</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="mt-6">
              <p className="text-arama-400 font-semibold text-sm">{restaurantInfo.tagline}</p>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mt-2">
                فحم والع، ولحم بلدي.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-arama-400 via-amber-200 to-arama-500">
                  هذا شغلنا.
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mt-4">
                من 12 الظهر لين 1:30 بالليل. اطلب ويوصلك حار.
              </p>
            </div>

            {/* Working Hours & Address */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-arama-400" />
                <span>{restaurantInfo.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-arama-400" />
                <span>{restaurantInfo.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onViewMenu}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-arama-500 to-arama-600 text-white font-bold text-base hover:from-arama-600 hover:to-arama-700 shadow-xl shadow-arama-500/25 transition-all flex items-center gap-3 group active:scale-95"
              >
                <span>شوف المنيو واطلب الآن</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>

              <a
                href={`tel:${restaurantInfo.phone}`}
                className="px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-arama-400" />
                <span>اتصل واحجز طلبك</span>
              </a>

              <button
                onClick={handleGetDirections}
                className="text-slate-300 text-sm font-medium underline underline-offset-8 decoration-slate-600 hover:text-white hover:decoration-amber-400 transition-colors flex items-center gap-1.5 py-4"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>وين مكاننا بالضبط؟</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-arama-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                  alt="مشويات آراما الفاخرة"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Highlight Badge */}
                <div className="absolute bottom-6 right-6 left-6 bg-slate-900/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-amber-400 text-xs font-bold">ينطلب كثير هالأسبوع</p>
                    <h3 className="text-white font-bold text-base mt-1 leading-snug">مشكّل كيلو — يكفي 3 إلى 4 أشخاص</h3>
                  </div>
                  <div className="bg-arama-500 text-white font-black px-4 py-2.5 rounded-xl text-base shadow-md">
                    185 ر.س
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
