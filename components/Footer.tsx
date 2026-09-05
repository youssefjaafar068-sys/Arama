import React from 'react';
import { UtensilsCrossed, Heart, Phone, MapPin, Clock } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-arama-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                آراما <span className="text-arama-500 font-light text-lg">| Arama</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {restaurantInfo.tagline} في {restaurantInfo.city}. نقدم أشهى المشويات على الفحم والمأكولات الطازجة بمعايير عالمية تليق بذوقكم الرفيع.
            </p>
          </div>

          {/* Hours Col */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">ساعات العمل</h4>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-arama-400" />
              <span>{restaurantInfo.hours}</span>
            </div>
            <p className="text-xs text-slate-500">طوال أيام الأسبوع لخدمتكم</p>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">معلومات التواصـل</h4>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-arama-400" />
              <span>{restaurantInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-arama-400" />
              <span>{restaurantInfo.address}</span>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {restaurantInfo.name} ({restaurantInfo.city}). جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            صُمم بِكل <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لتقديم تجربة طعام راقية
          </p>
        </div>

      </div>
    </footer>
  );
};
