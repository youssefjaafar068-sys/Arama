import React from 'react';
import { Phone, MapPin, Clock, MessageSquare, Instagram, Navigation } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-arama-400 font-bold text-sm bg-arama-500/10 px-3.5 py-1.5 rounded-xl border border-arama-500/20">
            تواصل معنا وزورنا
          </span>
          <h2 className="text-3xl sm:text-5xl font-black">يسعدنا خدمتك وتلبية طلباتك</h2>
          <p className="text-slate-400 text-base">
            تفضل بزيارتنا في فرعنا بحفر الباطن أو تواصل معنا عبر الهاتف وواتساب في أي وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Phone Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl text-center space-y-4 shadow-xl hover:border-arama-500 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-arama-500/20 text-arama-400 flex items-center justify-center">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">اتصل بنا مباشرة</h3>
            <p className="text-slate-400 text-sm">للحجز والاستفسارات السريعة</p>
            <a
              href={`tel:${restaurantInfo.phone}`}
              className="inline-block px-6 py-3 rounded-xl bg-arama-500 text-white font-bold text-sm hover:bg-arama-600 transition-colors"
            >
              {restaurantInfo.phone}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl text-center space-y-4 shadow-xl hover:border-emerald-500 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">الطلب عبر واتساب</h3>
            <p className="text-slate-400 text-sm">اطلب بسهولة واستلم طلبك بسرعة</p>
            <a
              href={`https://wa.me/${restaurantInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
            >
              تواصل عبر واتساب
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl text-center space-y-4 shadow-xl hover:border-amber-500 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">موقع المطعم</h3>
            <p className="text-slate-400 text-sm">{restaurantInfo.address}، {restaurantInfo.city}</p>
            <a
              href="https://maps.google.com/?q=Hafar+Al-Batin+Arama+Restaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-600 transition-colors"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>فتح خريطة جوجل</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
