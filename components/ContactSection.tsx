import React from 'react';
import { Phone, MapPin, MessageSquare, Navigation } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black">جوعان؟ هذا مكانك.</h2>
          <p className="text-slate-400 text-sm mt-3">
            فرعنا واحد في {restaurantInfo.city} — {restaurantInfo.address}. دق علينا أو راسلنا واتساب، نجهز طلبك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          <div className="md:col-span-5 bg-arama-500 p-7 rounded-3xl text-white shadow-xl shadow-arama-500/20">
            <div className="flex items-center gap-2 text-arama-100 text-xs font-bold">
              <Phone className="w-4 h-4" />
              <span>أسرع طريقة</span>
            </div>
            <h3 className="text-2xl font-black mt-2">دق علينا مباشرة</h3>
            <p className="text-arama-100 text-sm mt-1">نرد من 12 الظهر لين 1:30 بالليل.</p>
            <a
              href={`tel:${restaurantInfo.phone}`}
              className="inline-block mt-5 px-7 py-3.5 rounded-xl bg-white text-arama-700 font-black text-base hover:bg-arama-50 transition-colors"
            >
              {restaurantInfo.phone}
            </a>
          </div>

          <div className="md:col-span-7 space-y-5">
            <div className="bg-slate-800/80 border border-slate-700/80 px-6 py-5 rounded-3xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">واتساب</h3>
                  <p className="text-slate-400 text-xs mt-0.5">أرسل طلبك كتابة واستلمه حار</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shrink-0"
              >
                راسلنا واتساب
              </a>
            </div>

            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-slate-300">{restaurantInfo.address}، {restaurantInfo.city}</span>
              </div>
              <a
                href="https://maps.google.com/?q=Hafar+Al-Batin+Arama+Restaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-300 underline underline-offset-8 decoration-slate-600 hover:text-white hover:decoration-amber-400 transition-colors shrink-0"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>افتح الموقع في قوقل ماب</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
