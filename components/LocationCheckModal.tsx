import React, { useState } from 'react';
import { MapPin, CheckCircle2, X, AlertCircle, Navigation, Phone, Locate } from 'lucide-react';
import { restaurantInfo } from '../data/mockData';
import { evaluateLocation } from '../lib/deliveryZones';
import { useAppStore } from '../lib/store';

interface LocationCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToMenu: (district: string, isSupported: boolean) => void;
}

export const LocationCheckModal: React.FC<LocationCheckModalProps> = ({
  isOpen,
  onClose,
  onProceedToMenu,
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isSupported: boolean;
    districtName: string;
  } | null>(null);

  const setCustomerInfo = useAppStore(state => state.setCustomerInfo);

  if (!isOpen) return null;

  const handleEvaluate = (districtName: string) => {
    if (!districtName.trim()) return;
    const res = evaluateLocation(districtName);
    setEvaluationResult({
      checked: true,
      isSupported: res.isSupported,
      districtName: res.districtName || districtName,
    });
    if (res.isSupported) {
      setCustomerInfo({ customerDistrict: res.districtName || districtName });
    }
  };

  const handleReset = () => {
    setCustomInput('');
    setEvaluationResult(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding via OpenStreetMap (Nominatim API - Free)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || "غير محدد";
          const city = data.address?.city || data.address?.town || data.address?.county || "";
          
          if (city.includes("حفر") || city.includes("Hafar")) {
             handleEvaluate(suburb);
          } else {
             // Location is outside Hafar Al Batin completely
             handleEvaluate("خارج حفر الباطن");
          }
        } catch (error) {
          alert("فشل في تحديد اسم الحي تلقائياً. يرجى إدخاله يدوياً.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("فشل في جلب الموقع. يرجى التأكد من تفعيل خدمات الموقع (GPS).");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1e1b19]/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#fff8f5] w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#dec0ba] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-arama-500 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1e1b19]">تحديد موقع التوصيل</h3>
              <p className="text-xs text-[#57423d] font-medium">مطعم آراما • حفر الباطن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8a726c] hover:text-[#1e1b19] hover:bg-[#f4ece8] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {!evaluationResult?.checked ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1e1b19]">
                أهلاً بك في مطعم آراما! يرجى تحديد موقعك (الحي في حفر الباطن):
              </label>
              
              <button 
                onClick={handleGetLocation} 
                disabled={isLocating}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#7b210d]/10 text-[#7b210d] hover:bg-[#7b210d]/20 font-bold flex items-center justify-center gap-2 border border-[#7b210d]/30 transition-colors"
              >
                <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'جاري تحديد موقعك...' : 'تحديد موقعي الحالي تلقائياً'}
              </button>
            </div>

            <div className="relative flex items-center py-2">
               <div className="flex-grow border-t border-[#dec0ba]"></div>
               <span className="flex-shrink-0 mx-4 text-[#8a726c] text-xs font-bold">أو اختر يدوياً</span>
               <div className="flex-grow border-t border-[#dec0ba]"></div>
            </div>

            {/* Quick district buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {['الخالدية', 'العزيزية', 'الفيصلية', 'النزهة', 'أبو موسى', 'الربوة', 'السليمانية', 'الشفاء', 'المحمدية'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleEvaluate(d)}
                  className="py-2.5 px-3 rounded-xl bg-[#f4ece8] hover:bg-[#e9e1dd] hover:text-[#7b210d] border border-[#dec0ba] text-xs font-bold text-[#57423d] transition-all text-right flex items-center justify-between"
                >
                  <span>{d}</span>
                  <MapPin className="w-3.5 h-3.5 text-arama-500" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-2 pt-2 border-t border-[#dec0ba]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: حي الخالدية، القيصومة..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#f4ece8] border border-[#dec0ba] text-sm text-[#1e1b19] focus:outline-none focus:border-[#7b210d]"
                />
                <button
                  onClick={() => handleEvaluate(customInput)}
                  disabled={!customInput.trim()}
                  className="px-6 py-3 rounded-xl bg-arama-500 hover:bg-arama-600 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all"
                >
                  تحقق
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* If Supported */}
            {evaluationResult.isSupported ? (
              <div className="p-6 rounded-2xl bg-[#5b614d]/10 border border-[#5b614d]/30 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-[#1e1b19]">موقعك في نطاق التوصيل!</h4>
                  <p className="text-sm text-[#57423d]">
                    حي <strong>{evaluationResult.districtName}</strong> مدعوم بخدمة التوصيل السريع من مطعم آراما.
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      onProceedToMenu(evaluationResult.districtName, true);
                      onClose();
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-[#5b614d] hover:bg-[#4d5040] text-white font-bold text-sm shadow-lg shadow-[#5b614d]/30 transition-all"
                  >
                    الانتقال للمنيو وطلب الوجبات
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-2xl bg-[#fff8f5] border border-[#dec0ba] text-[#7b210d] font-bold text-sm hover:bg-[#e9e1dd] transition-colors"
                  >
                    تغيير الموقع
                  </button>
                </div>
              </div>
            ) : (
              /* If OUT of Zone */
              <div className="p-6 rounded-2xl bg-[#fef3e7] border border-[#dec0ba] space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-black text-[#7b210d]">نعتذر منك عزيزي!</h4>
                  <p className="text-sm text-[#7b210d] leading-relaxed">
                    موقعك حالياً (<strong>{evaluationResult.districtName}</strong>) خارج نطاق التوصيل لدينا. ولكن يسعدنا جداً اطلاعك على المنيو وتصفح أطباقنا، ونتشرف بزيارتك لنا في الفرع!
                  </p>
                </div>

                {/* Branch Info */}
                <div className="bg-[#fff8f5] p-4 rounded-xl border border-[#dec0ba] space-y-2 text-xs text-[#1e1b19]">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-arama-500" />
                    <span>عنوان الفرع: {restaurantInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#57423d]">
                    <Phone className="w-4 h-4 text-[#7b210d]" />
                    <span>هاتف الفرع: {restaurantInfo.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => {
                      onProceedToMenu(evaluationResult.districtName, false);
                      onClose();
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-arama-500 hover:bg-arama-600 text-white font-bold text-sm shadow-md transition-all text-center"
                  >
                    عرض المنيو والأسعار
                  </button>
                  <a
                    href="https://maps.google.com/?q=Hafar+Al-Batin+Arama+Restaurant"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3.5 px-4 rounded-2xl bg-[#1e1b19] hover:bg-[#33302d] text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>موقع الفرع</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className="w-full py-2 text-xs font-bold text-[#57423d] hover:text-[#1e1b19] underline"
                  >
                    إعادة تحديد الموقع
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
