import React, { useState } from 'react';
import { Flame, Sparkles, ChevronDown, ChevronUp, Award, Utensils, BookOpen } from 'lucide-react';

interface ThinkingCulinarySectionProps {
  language: 'ar' | 'en';
}

export const ThinkingCulinarySection: React.FC<ThinkingCulinarySectionProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [partySize, setPartySize] = useState('6 ضيوف');
  const [preferences, setPreferences] = useState('لحم معتق + فخاريات حجرية مع مشروبات التمر هندي والسيدرا');
  const [isLoading, setIsLoading] = useState(false);
  const [showThoughts, setShowThoughts] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    thoughts?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = language === 'ar' ? [
    {
      label: 'وليمة 10 أشخاص متوازنة (شوليتون + فخاريات حجرية)',
      query: 'تصميم وليمة متكاملة لعشرة أشخاص تجمع بين شوليتون الباسك المعتق وفخارة الموزات الحجرية، مع تحديد التوقيت الدقيق للجمر، وحرارة الفرن، وتوزيع الأطباق والمشروبات المتوافقة مع حموضة دهن اللحم.',
    },
    {
      label: 'موازنة أخشاب الشواء (حطب السنديان المعمر مع الزيتون)',
      query: 'كيف نوازن بين حطب السنديان المعمر لحرارة الشوليتون وحطب الزيتون العطري لريش الغنم، مع جدول درجات الحرارة الداخلية للوصول إلى استواء Saignant مثالي؟',
    },
    {
      label: 'قائمة عشاء نباتية مدخنة من قلب الفرن والرماد',
      query: 'ابتكار قائمة طعام نباتية راقية تعتمد كلياً على طهي الخضار في الرماد الساخن والفرن الحجري مع صوصات الطحينة ودبس الرمان والمخللات المنزلية.',
    },
  ] : [
    {
      label: '10-Guest Grand Banquet (Txuleta + Clay Pots)',
      query: 'Architect an uncompromising 10-person degustation pairing 45-day dry-aged Txuleta ribeye with 6-hour stone oven lamb shanks. Detail the ember heat zones, course pacing, and how natural Basque cider acidity cleanses the palate.',
    },
    {
      label: 'Wood Combustion & Internal Cut Temperatures',
      query: 'Analyze the thermodynamic difference between Holm oak embers vs olive wood for searing vs resting, with exact core temperature milestones for the ultimate medium-rare crust.',
    },
    {
      label: 'Smoked Vegetarian Hearth Degustation',
      query: 'Design an elevated vegetable degustation using direct-ash roasting, blistered peppers, and wild sourdough flatbreads with rich nutty tahini reductions.',
    },
  ];

  const handleAsk = async (customText?: string) => {
    const q = customText || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/thinking-culinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          diningPartySize: partySize,
          dietaryPreferences: preferences,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Consultation inquiry failed');
      }

      setResult({
        answer: data.answer,
        thoughts: data.thoughts,
      });
    } catch (err: any) {
      console.error('Culinary consultation error:', err);
      setErrorMsg(
        err.message ||
          (language === 'ar'
            ? 'تعذر تقديم الاستشارة الطهوية حالياً. يرجى المحاولة بعد قليل.'
            : 'Chef consultation unavailable at the moment. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="thinking-sommelier" className="py-16 bg-[#fff8f5] border-t border-[#dec0ba]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#7b210d]/10 text-[#7b210d] rounded-full text-xs font-ledger uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فلسفة بيت النار والضيافة الكبرى' : 'GRAND ASADOR CULINARY COUNSEL'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[#1e1b19] mb-4">
            {language === 'ar'
              ? 'استشارة كبير طهاة آراما: هندسة الولائم وتناغم النيران'
              : 'The Chef Patron’s Gastronomic Consultation'}
          </h2>
          <p className="font-editorial text-lg text-[#57423d] leading-relaxed">
            {language === 'ar'
              ? 'اطرح أدق الأسئلة الطهوية حول إعداد الولائم الفاخرة، أو توازن درجات حرارة الجمر لأصناف اللحوم المختلفة، أو توافق أطباق الفرن الحجري مع المشروبات التراثية.'
              : 'Seek master-level guidance on orchestrating grand hearth banquets, managing ember heat zones across dry-aged cuts, and harmonizing clay pots with traditional cordials.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Query & Configuration Inputs */}
          <div className="lg:col-span-5 bg-[#faf2ee] p-6 sm:p-7 rounded-2xl border border-[#dec0ba] shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#dec0ba]">
              <span className="font-display font-bold text-sm text-[#1e1b19]">
                {language === 'ar' ? 'تفاصيل المائدة والوليمة' : 'Table & Banquet Blueprint'}
              </span>
              <span className="text-xs font-ledger text-[#7b210d]">
                {language === 'ar' ? 'استشارة خاصة' : 'Private Consultation'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-display font-bold text-[#57423d] mb-1.5">
                  {language === 'ar' ? 'عدد الضيوف:' : 'Guest Count:'}
                </label>
                <input
                  type="text"
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#dec0ba] rounded-lg px-3.5 py-2 text-xs font-editorial text-[#1e1b19] focus:outline-none focus:border-[#7b210d]"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-bold text-[#57423d] mb-1.5">
                  {language === 'ar' ? 'التفضيلات الخاصة:' : 'Special Requests:'}
                </label>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#dec0ba] rounded-lg px-3.5 py-2 text-xs font-editorial text-[#1e1b19] focus:outline-none focus:border-[#7b210d]"
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="block text-xs font-display font-bold text-[#57423d] mb-2.5">
                {language === 'ar' ? 'سيناريوهات مقترحة من سجل الطاهي:' : 'Curated Tasting Blueprints:'}
              </span>
              <div className="space-y-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(p.query);
                      handleAsk(p.query);
                    }}
                    className="w-full text-right p-3 bg-[#fff8f5] hover:bg-[#eee7e3] border border-[#dec0ba] rounded-xl text-xs transition text-[#1e1b19] font-editorial flex items-start gap-2.5 cursor-pointer shadow-xs"
                  >
                    <Flame className="w-4 h-4 text-[#7b210d] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#7b210d] text-xs font-display">{p.label}</p>
                      <p className="text-[#57423d] line-clamp-2 mt-0.5">{p.query}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom query input */}
            <div>
              <label className="block text-xs font-display font-bold text-[#57423d] mb-1.5">
                {language === 'ar' ? 'استفسارك الخاص لكبير الطهاة:' : 'Your Custom Culinary Request:'}
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'مثال: كيف أوزع تقديم أطباق الشوليتون وفخارة الموزات مع الحفاظ على حرارة التقديم وتناغم المشروبات؟'
                    : 'e.g., How to balance course pacing between ember ribeye and clay pot lamb...'
                }
                className="w-full bg-[#fff8f5] border border-[#dec0ba] rounded-xl p-3.5 text-xs sm:text-sm text-[#1e1b19] focus:outline-none focus:border-[#7b210d] font-editorial resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !query.trim()}
              className="w-full py-3.5 bg-[#7b210d] hover:bg-[#9b3822] disabled:opacity-40 text-white rounded-xl font-display text-sm tracking-wide font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ar' ? 'جاري صياغة الاستشارة الطهوية...' : 'Formulating Master Counsel...'}</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-[#ffc1b4]" />
                  <span>{language === 'ar' ? 'طلب استشارة كبير الطهاة' : 'Request Chef Consultation'}</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-[#faf2ee] p-6 sm:p-7 rounded-2xl border border-[#dec0ba] shadow-sm min-h-[480px] flex flex-col">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#dec0ba] mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#7b210d]" />
                <span className="font-display font-bold text-base text-[#1e1b19]">
                  {language === 'ar' ? 'مخطط الوليمة وتوصيات المائدة' : 'The Chef’s Degustation Blueprint'}
                </span>
              </div>
              <span className="font-editorial text-xs text-[#57423d]">
                {language === 'ar' ? 'مطعم آراما · بيت النار' : 'Arama Asador & Hearth'}
              </span>
            </div>

            {isLoading && (
              <div className="my-auto text-center py-16 space-y-4">
                <div className="w-10 h-10 border-3 border-[#7b210d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-display text-base text-[#7b210d] font-bold">
                  {language === 'ar' ? 'كبير الطهاة يفحص تفاصيل مائدتكم بعناية...' : 'The Chef Patron is Reviewing Your Menu...'}
                </p>
                <p className="font-editorial text-sm text-[#57423d] max-w-md mx-auto">
                  {language === 'ar'
                    ? 'يتم فحص أزمنة نضوج اللحوم، وتوزيع طاقة الفرن الحجري، وتناغم النكهات الحامضة لكسر دسامة الجمر.'
                    : 'Balancing ember thermodynamics, resting intervals, and palate-cleansing cellar pairings.'}
                </p>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4 flex-1">
                
                {/* Optional thoughts / chef methodology disclosure */}
                {result.thoughts && (
                  <div className="bg-[#f4ece8] rounded-xl border border-[#dec0ba] overflow-hidden">
                    <button
                      onClick={() => setShowThoughts(!showThoughts)}
                      className="w-full px-4 py-2.5 bg-[#eee7e3] text-right flex items-center justify-between text-xs font-display text-[#57423d] cursor-pointer"
                    >
                      <span className="font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#7b210d]" />
                        {language === 'ar' ? 'منهجية الطهي وتوزيع النيران خلف الكواليس' : 'Culinary Methodology & Flame Dynamics'}
                      </span>
                      {showThoughts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showThoughts && (
                      <div className="p-4 text-xs text-[#57423d] font-editorial leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto bg-[#faf2ee]">
                        {result.thoughts}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Master Recommendation */}
                <div className="bg-[#fff8f5] p-6 rounded-xl border border-[#dec0ba] text-base text-[#1e1b19] font-editorial leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto shadow-xs">
                  {result.answer}
                </div>

                <div className="flex items-center justify-between text-xs font-editorial text-[#5b614d] pt-2">
                  <span>{language === 'ar' ? 'مخطط طهوي مفصل معتمد من بيت النار' : 'Approved Hearth Gastronomic Blueprint'}</span>
                  <span>Arama Signature Standard</span>
                </div>
              </div>
            )}

            {!result && !isLoading && (
              <div className="my-auto text-center py-16 text-[#8a726c]">
                <Flame className="w-12 h-12 text-[#dec0ba] mx-auto mb-3" />
                <p className="font-display text-lg text-[#1e1b19] font-bold mb-1">
                  {language === 'ar' ? 'في انتظار تفاصيل مائدتك الخاصة' : 'Awaiting Your Table Specifications'}
                </p>
                <p className="font-editorial text-sm text-[#57423d] max-w-md mx-auto">
                  {language === 'ar'
                    ? 'اختر أحد نماذج الولائم على اليمين أو اكتب رغباتك للحصول على توصية استثنائية من كبير الطهاة.'
                    : 'Choose a tasting scenario or enter your dining party size to receive a bespoke menu blueprint.'}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
