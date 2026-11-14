import React, { useState } from 'react';
import { calculateGrillTiming } from '../utils/culinary-logic.ts';
import { Flame, Clock, Thermometer, Sparkles, Check, Info } from 'lucide-react';

interface AsadorGrillSimulatorProps {
  language: 'ar' | 'en';
}

export const AsadorGrillSimulator: React.FC<AsadorGrillSimulatorProps> = ({ language }) => {
  const [selectedCut, setSelectedCut] = useState<'txuleta' | 'lamb' | 'shank' | 'turbot'>('txuleta');
  const [weightGrams, setWeightGrams] = useState(900);
  const [doneness, setDoneness] = useState<'bleu' | 'rare' | 'medium_rare' | 'medium' | 'well_done'>('medium_rare');
  const [emberTemp, setEmberTemp] = useState(440);

  const timing = calculateGrillTiming(weightGrams, doneness, emberTemp);

  const donenessOptions = [
    { id: 'bleu' as const, labelAr: 'بلو (خام دافئ)', labelEn: 'Bleu', temp: '45°C' },
    { id: 'rare' as const, labelAr: 'أحمر نادر (Saignant)', labelEn: 'Rare', temp: '50°C' },
    { id: 'medium_rare' as const, labelAr: 'نصف استواء مثالي (À Point)', labelEn: 'Medium-Rare', temp: '54°C' },
    { id: 'medium' as const, labelAr: 'متوسط الاستواء', labelEn: 'Medium', temp: '60°C' },
    { id: 'well_done' as const, labelAr: 'ناضج تماماً', labelEn: 'Well Done', temp: '70°C' },
  ];

  return (
    <div className="bg-[#fff8f5] p-6 rounded-xl border border-[#dec0ba] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#dec0ba] mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#7b210d] text-white rounded">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1e1b19]">
              {language === 'ar' ? 'حاسبة الجمر ومؤقت الشواء الباسكي' : 'Basque Asador Ember Simulator'}
            </h3>
            <p className="font-ledger text-[11px] text-[#8a726c]">
              Parrilla & Txuleta Thermodynamic Physics
            </p>
          </div>
        </div>
        <span className="font-ledger text-xs bg-[#f4ece8] text-[#7b210d] px-2.5 py-1 rounded border border-[#dec0ba]">
          {emberTemp}°C Embers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Controls */}
        <div className="space-y-4">
          
          {/* Cut Selection */}
          <div>
            <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1.5">
              {language === 'ar' ? 'نوع القطعية:' : 'Selected Cut:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedCut('txuleta'); setWeightGrams(950); }}
                className={`p-2.5 rounded-lg border text-xs font-editorial text-right transition ${
                  selectedCut === 'txuleta'
                    ? 'bg-[#7b210d] text-white border-[#7b210d]'
                    : 'bg-[#faf2ee] text-[#1e1b19] border-[#dec0ba] hover:bg-[#eee7e3]'
                }`}
              >
                <span className="font-bold block font-display">Txuleta Ribeye</span>
                <span className="text-[10px] opacity-80">{language === 'ar' ? 'لحم بقر معتق بالعظم' : 'Bone-in dry aged'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedCut('lamb'); setWeightGrams(450); }}
                className={`p-2.5 rounded-lg border text-xs font-editorial text-right transition ${
                  selectedCut === 'lamb'
                    ? 'bg-[#7b210d] text-white border-[#7b210d]'
                    : 'bg-[#faf2ee] text-[#1e1b19] border-[#dec0ba] hover:bg-[#eee7e3]'
                }`}
              >
                <span className="font-bold block font-display">Lamb Chops</span>
                <span className="text-[10px] opacity-80">{language === 'ar' ? 'ريش غنم جبلية' : 'Rosemary infused'}</span>
              </button>
            </div>
          </div>

          {/* Weight Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-ledger mb-1">
              <span className="text-[#8a726c] uppercase">{language === 'ar' ? 'وزن القطعية:' : 'Cut Weight:'}</span>
              <span className="font-bold text-[#7b210d]">{weightGrams}g ({((weightGrams / 1000) * 2.2).toFixed(1)} lbs)</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={weightGrams}
              onChange={(e) => setWeightGrams(Number(e.target.value))}
              className="w-full accent-[#7b210d]"
            />
          </div>

          {/* Doneness Selector */}
          <div>
            <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1.5">
              {language === 'ar' ? 'درجة الاستواء المرغوبة:' : 'Desired Doneness:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {donenessOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDoneness(opt.id)}
                  className={`px-3 py-2 rounded text-xs font-editorial text-right flex items-center justify-between border transition ${
                    doneness === opt.id
                      ? 'bg-[#1e1b19] text-white border-[#1e1b19]'
                      : 'bg-[#faf2ee] text-[#57423d] border-[#dec0ba] hover:bg-[#eee7e3]'
                  }`}
                >
                  <span>{language === 'ar' ? opt.labelAr : opt.labelEn}</span>
                  <span className="text-[10px] font-ledger opacity-80">{opt.temp}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Gauges & Recommendation */}
        <div className="bg-[#faf2ee] p-5 rounded-xl border border-[#dec0ba] flex flex-col justify-between">
          
          <div className="space-y-4">
            <span className="text-xs font-ledger text-[#7b210d] uppercase tracking-wider block font-bold">
              {language === 'ar' ? 'نتائج مؤقت الشواء الدقيق:' : 'GRILL TIMING SPECIFICATIONS:'}
            </span>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#dec0ba]">
                <div className="flex items-center gap-1.5 text-xs text-[#8a726c] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#7b210d]" />
                  <span>{language === 'ar' ? 'الشواء لكل جانب' : 'Sear Per Side'}</span>
                </div>
                <p className="text-xl font-bold font-display text-[#1e1b19]">
                  {Math.floor(timing.searSecondsPerSide / 60)}m {timing.searSecondsPerSide % 60}s
                </p>
              </div>

              <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#dec0ba]">
                <div className="flex items-center gap-1.5 text-xs text-[#8a726c] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#7b210d]" />
                  <span>{language === 'ar' ? 'حرارة القلب' : 'Target Core'}</span>
                </div>
                <p className="text-xl font-bold font-display text-[#7b210d]">
                  {timing.internalTargetC}°C
                </p>
              </div>
            </div>

            {/* Resting note */}
            <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#dec0ba] text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#1e1b19] mb-1">
                <Info className="w-3.5 h-3.5 text-[#5b614d]" />
                <span>{language === 'ar' ? 'فترة الراحة بعد النار (Resting):' : 'Mandatory Board Resting:'}</span>
              </div>
              <p className="text-[#57423d] font-editorial leading-relaxed">
                {language === 'ar'
                  ? `دع القطعة ترتاح لمدة ${timing.restingMinutes} دقائق على لوح خشب البلوط الدافئ لإعادة امتصاص العصارات قبل التقطيع.`
                  : `Allow to rest ${timing.restingMinutes} minutes on warm oak board to re-equilibrate intra-muscular juices before slicing.`}
              </p>
            </div>

            {/* Recommended wood */}
            <div className="text-xs font-editorial text-[#57423d]">
              <span className="font-bold text-[#1e1b19]">{language === 'ar' ? 'خشب الجمر الموصى به: ' : 'Recommended Firewood: '}</span>
              <span className="text-[#7b210d] font-ledger text-[11px]">{timing.recommendedWood}</span>
            </div>

          </div>

          <div className="pt-3 border-t border-[#dec0ba] flex items-center justify-between text-[11px] text-[#8a726c] font-ledger">
            <span>Biscay Flaky Sea Salt</span>
            <span>Oak Embers: White Hot</span>
          </div>

        </div>

      </div>
    </div>
  );
};
