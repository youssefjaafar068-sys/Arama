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
              <span>قصة نجاح وعراقة في حفر الباطن</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              نقدم ألذ المشويات والمأكولات بجودة استثنائية وأصالة لا تُنسى
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
              يُعد <strong className="text-slate-900 font-bold">مطعم آراما</strong> في {restaurantInfo.city} الوجهة الأولى لعشاق المشويات الطازجة على الفحم والمأكولات الشرقية والغربية المتنوعة. نحرص دائماً على اختيار أجود أنواع اللحوم الطازجة والدواجن المحلية وتقديمها بمعايير نظافة وجودة عالمية.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-arama-500 text-white mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">لحوم بلدية طازجة</h3>
                  <p className="text-slate-500 text-xs mt-1">نختار لحومنا بعناية يومياً لضمان الطعم والرائحة الذكية.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-arama-500 text-white mt-1">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">وصفات أصلية</h3>
                  <p className="text-slate-500 text-xs mt-1">تتبيلات خاصة وأسرار طهي تجعل كل وجبة تجربة فريدة.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
