import React from 'react';
import { Utensils, Award, Heart, ShieldCheck } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80"
                alt="كباب مشوي"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
                alt="مشويات آراما"
                className="w-full h-48 object-cover rounded-3xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=500&q=80"
                alt="شيش طاووق"
                className="w-full h-48 object-cover rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80"
                alt="مطعم آراما حفر الباطن"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 text-arama-600 font-bold text-sm bg-arama-50 px-3.5 py-1.5 rounded-xl">
              <Award className="w-4 h-4" />
              <span>من 2019 وحنا على الفحم</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              نعرف وش نطبخ. ونطبخه زين.
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              <strong className="text-slate-900 font-bold">آراما</strong> في {restaurantInfo.city}: لحم بلدي يوصلنا طازج كل صباح، يتبل بخلطتنا، وينشوى على الفحم قدامك. بدون فلسفة زايدة.
            </p>

            <p className="text-slate-500 text-sm leading-relaxed">
              تبي عشاء عائلي؟ المشكّل الكيلو يكفيكم. تبي شيء خفيف؟ المقبلات عندنا تنعمل يوم بيوم.
            </p>

            {/* Feature Highlights */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-arama-500 text-white shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-slate-700 text-sm font-semibold">لحم بلدي طازج — يوصلنا كل صباح، ما نجمّد.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-arama-400" />
                  <h3 className="font-bold text-sm">خلطة آراما</h3>
                </div>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">تتبيلة وحدة من 2019 ما غيرناها. اللي ذاقها يعرفها.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
