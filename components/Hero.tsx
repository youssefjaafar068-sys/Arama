import React from 'react';
import { Star, Clock, MapPin, Phone, ArrowLeft, Navigation, Sparkles } from 'lucide-react';
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

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{restaurantInfo.rating} ({restaurantInfo.reviewCount.toLocaleString('ar-SA')} تقييم)</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-arama-400 font-semibold text-sm bg-arama-500/10 px-3 py-1 rounded-lg">
                <Sparkles className="w-4 h-4" />
                <span>{restaurantInfo.tagline}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                أهلاً بكم في <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-arama-400 via-amber-200 to-arama-500">
                  {restaurantInfo.name}
                </span>
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
                نقدم لكم أشهى المشويات على الفحم والمأكولات المتنوعة الطازجة في {restaurantInfo.city}. جودة لا تُضاهى ونكهات أصيلة تأسر الحواس.
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
                <span>استعرض قائمة الطعام</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>

              <a
                href={`tel:${restaurantInfo.phone}`}
                className="px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-arama-400" />
                <span>اتصل بالمطعم</span>
              </a>

              <button
                onClick={handleGetDirections}
                className="px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <Navigation className="w-5 h-5 text-amber-400" />
                <span>الاتجاهات</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-arama-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="مشويات آراما الفاخرة"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Highlight Badge */}
                <div className="absolute bottom-6 right-6 left-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-arama-400 text-xs font-bold uppercase tracking-wider">الطبق المميز</span>
                    <h3 className="text-white font-bold text-lg mt-0.5">مشويات مشكلة آراما الفاخرة</h3>
                    <p className="text-slate-400 text-xs mt-1">تشكيلة ألذ المشويات على الفحم الطازج</p>
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
