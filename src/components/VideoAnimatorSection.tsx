import React, { useState } from 'react';
import { PRESET_ANIMATION_PHOTOS } from '../data/restaurant-data.ts';
import { Film, Upload, Play, RefreshCw, Download, Check, AlertCircle, Sparkles, Flame } from 'lucide-react';

interface VideoAnimatorSectionProps {
  language: 'ar' | 'en';
}

export const VideoAnimatorSection: React.FC<VideoAnimatorSectionProps> = ({ language }) => {
  const [selectedPreset, setSelectedPreset] = useState<(typeof PRESET_ANIMATION_PHOTOS)[0]>(PRESET_ANIMATION_PHOTOS[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [promptText, setPromptText] = useState(PRESET_ANIMATION_PHOTOS[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(language === 'ar' ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomImageBase64(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: (typeof PRESET_ANIMATION_PHOTOS)[0]) => {
    setSelectedPreset(preset);
    setCustomImageBase64(null);
    setAspectRatio(preset.aspectRatio);
    setPromptText(preset.prompt);
    setErrorMsg(null);
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedVideoUrl(null);
    setGenerationStage(
      language === 'ar'
        ? 'تحليل إشعاع الجمر وانعكاسات لهب الفرن الحجري...'
        : 'Capturing fire ember dynamics and wood smoke trails...'
    );

    try {
      let imagePayload = customImageBase64;
      let mimeType = 'image/jpeg';

      if (!imagePayload) {
        setGenerationStage(
          language === 'ar' ? 'جلب الإطار الأصلي للطبق من بيت النار...' : 'Extracting hearth master frame...'
        );
        const response = await fetch(selectedPreset.url);
        const blob = await response.blob();
        mimeType = blob.type || 'image/jpeg';
        imagePayload = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      setGenerationStage(
        language === 'ar'
          ? 'بث الروح الحية في الطبق وتصوير حركة اللهب ودخان السنديان...'
          : 'Synthesizing living flame motion and sizzling wood-fire juices...'
      );

      const res = await fetch('/api/gemini/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePayload,
          mimeType,
          prompt: promptText,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Video generation failed');
      }

      setGeneratedVideoUrl(data.videoUrl);
      setGenerationStage(language === 'ar' ? 'اكتمل المشهد السينمائي للطبق!' : 'Hearth motion video ready!');
    } catch (err: any) {
      console.error('Animation error:', err);
      setErrorMsg(
        err.message ||
          (language === 'ar'
            ? 'تعذر توليد الفيديو حالياً. يرجى إعادة المحاولة بعد لحظات.'
            : 'Unable to render the live motion clip. Please try again in a moment.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPreviewImage = customImageBase64 || selectedPreset.url;

  return (
    <section id="video-animator" className="py-16 bg-[#faf2ee] border-y border-[#dec0ba]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header without AI tech jargon */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#7b210d]/10 text-[#7b210d] rounded-full text-xs font-ledger uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'استوديو مشهد النار والطهي الحي' : 'THE LIVING HEARTH CINEMATHEQUE'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[#1e1b19] mb-4">
            {language === 'ar'
              ? 'شاهد أطايب آراما تنبض بالحياة على الجمر'
              : 'Watch the Fire Come Alive Around Your Cut'}
          </h2>
          <p className="font-editorial text-lg text-[#57423d] leading-relaxed">
            {language === 'ar'
              ? 'اختر أحد أطباقنا أو ارفع صورة طبقك على المائدة، وشاهد تصاعد دخان السنديان المعمر وفوران العصارات الذهبية بحركة سينمائية حية تجسد روح بيت النار.'
              : 'Select a signature cut or upload your table photo to witness living wood-smoke eddies, crackling embers, and glistening juices in full cinematic motion.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls & Selection */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Pick a signature cut or upload */}
            <div className="bg-[#fff8f5] p-6 rounded-2xl border border-[#dec0ba] shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-display text-sm font-bold text-[#1e1b19]">
                  {language === 'ar' ? '١. اختر الطبق من المطبخ أو ارفع صورة مائدتك' : '1. Choose Cut or Upload Table Photo'}
                </span>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#7b210d] hover:text-[#9b3822] font-ledger bg-[#f4ece8] hover:bg-[#e9e1dd] px-3 py-1.5 rounded-lg border border-[#dec0ba] transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'رفع صورة خاصة' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_ANIMATION_PHOTOS.map((preset) => {
                  const isSelected = !customImageBase64 && selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative rounded-xl overflow-hidden border-2 text-right transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-[#7b210d] ring-2 ring-[#7b210d]/30 shadow-md'
                          : 'border-transparent hover:border-[#dec0ba]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.titleEn}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-2">
                        <span className="text-[11px] font-bold text-white leading-tight font-display">
                          {language === 'ar' ? preset.titleAr : preset.titleEn}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 bg-[#7b210d] text-white rounded-full p-0.5 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {customImageBase64 && (
                <div className="mt-3 p-2.5 bg-[#f4ece8] rounded-lg border border-[#dec0ba] flex items-center justify-between text-xs">
                  <span className="text-[#1e1b19] font-medium font-editorial">
                    {language === 'ar' ? 'صورة الطبق الخاصة جاهزة للتحريك' : 'Custom photo ready for animation'}
                  </span>
                  <button
                    onClick={() => setCustomImageBase64(null)}
                    className="text-[#ba1a1a] hover:underline text-xs font-ledger"
                  >
                    {language === 'ar' ? 'إلغاء المرفوع' : 'Remove'}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Aspect Ratio Selector */}
            <div className="bg-[#fff8f5] p-6 rounded-2xl border border-[#dec0ba] shadow-sm">
              <span className="font-display text-sm font-bold text-[#1e1b19] block mb-3">
                {language === 'ar' ? '٢. تنسيق زاوية العرض السينمائي' : '2. Cinematic Frame Format'}
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3.5 rounded-xl border text-right sm:text-center transition-all cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-[#7b210d] text-white border-[#7b210d] shadow'
                      : 'bg-[#f4ece8] text-[#1e1b19] border-[#dec0ba] hover:bg-[#e9e1dd]'
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-center sm:gap-2 mb-1">
                    <span className="font-bold font-display text-base">
                      {language === 'ar' ? 'شاشة عريضة (أفقي)' : 'Landscape Cinema'}
                    </span>
                    <span className="text-[10px] font-ledger uppercase px-1.5 py-0.5 rounded bg-black/20">
                      16:9
                    </span>
                  </div>
                  <p className="text-[11px] opacity-85 font-editorial">
                    {language === 'ar' ? 'لتفاصيل صواني الفرن والولائم الكاملة' : 'Ideal for full banquet table views'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3.5 rounded-xl border text-right sm:text-center transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-[#7b210d] text-white border-[#7b210d] shadow'
                      : 'bg-[#f4ece8] text-[#1e1b19] border-[#dec0ba] hover:bg-[#e9e1dd]'
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-center sm:gap-2 mb-1">
                    <span className="font-bold font-display text-base">
                      {language === 'ar' ? 'مشهد عمودي (بورتريه)' : 'Portrait Reel'}
                    </span>
                    <span className="text-[10px] font-ledger uppercase px-1.5 py-0.5 rounded bg-black/20">
                      9:16
                    </span>
                  </div>
                  <p className="text-[11px] opacity-85 font-editorial">
                    {language === 'ar' ? 'لقطات مقربة لتصاعد اللهب والشرر' : 'Perfect for vertical flames & mobile view'}
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Motion Prompt / Hearth Atmosphere */}
            <div className="bg-[#fff8f5] p-6 rounded-2xl border border-[#dec0ba] shadow-sm">
              <span className="font-display text-sm font-bold text-[#1e1b19] block mb-2">
                {language === 'ar' ? '٣. تفاصيل أجواء النار والجمر المرجوة' : '3. Hearth Fire & Smoke Atmosphere'}
              </span>
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe embers, smoke, steam, lighting..."
                className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-xl p-3.5 text-xs sm:text-sm text-[#1e1b19] focus:outline-none focus:border-[#7b210d] font-editorial leading-relaxed resize-none"
              />
            </div>

            {/* Generate CTA Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-[#7b210d] hover:bg-[#9b3822] disabled:opacity-50 text-white rounded-xl font-display text-base tracking-wide font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{language === 'ar' ? 'جاري بث الحركة السينمائية في الطبق...' : 'Breathing Life into the Hearth...'}</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 text-[#ffc1b4]" />
                  <span>{language === 'ar' ? 'إشعال المشهد وبث الحركة في الطبق' : 'Animate Sizzling Hearth Video'}</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Video Preview & Output Canvas */}
          <div className="lg:col-span-6 bg-[#fff8f5] p-6 rounded-2xl border border-[#dec0ba] shadow-sm flex flex-col items-center justify-center min-h-[500px]">
            
            <div className="w-full flex items-center justify-between pb-3.5 border-b border-[#dec0ba] mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#7b210d]" />
                <span className="font-display font-bold text-sm text-[#1e1b19]">
                  {language === 'ar' ? 'نافذة العرض الحي للأطباق' : 'Living Hearth Viewport'}
                </span>
              </div>
              <span className="font-ledger text-xs text-[#8a726c] bg-[#f4ece8] px-3 py-1 rounded-full">
                {aspectRatio} Format
              </span>
            </div>

            <div
              className={`w-full max-w-md mx-auto rounded-xl overflow-hidden border border-[#dec0ba] bg-[#1e1b19] relative flex items-center justify-center transition-all ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[540px]' : 'aspect-video'
              }`}
            >
              {generatedVideoUrl ? (
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={currentPreviewImage}
                    alt="Current selection"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center p-4 text-center">
                    {isGenerating ? (
                      <div className="p-5 bg-black/80 backdrop-blur-md rounded-2xl max-w-xs text-white">
                        <div className="w-9 h-9 border-3 border-[#ffc1b4] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="font-display font-bold text-sm text-[#ffc1b4] mb-1">
                          {language === 'ar' ? 'الطهي السينمائي قيد التنفيذ' : 'Crafting Cinematic Embers'}
                        </p>
                        <p className="font-editorial text-xs text-[#dec0ba] leading-relaxed">
                          {generationStage}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-black/60 backdrop-blur-sm rounded-full text-white/90">
                        <Play className="w-8 h-8 fill-white/90" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {generatedVideoUrl && (
              <div className="w-full mt-4 flex items-center justify-between pt-3 border-t border-[#dec0ba]">
                <div className="flex items-center gap-1.5 text-xs text-[#5b614d] font-editorial font-bold">
                  <Check className="w-4 h-4 text-[#5b614d]" />
                  <span>{language === 'ar' ? 'المشهد السينمائي جاهز للمشاهدة والمشاركة' : 'Cinematic motion ready'}</span>
                </div>
                <a
                  href={generatedVideoUrl}
                  download={`arama-hearth-${aspectRatio.replace(':', '-')}.mp4`}
                  className="inline-flex items-center gap-1.5 bg-[#1e1b19] hover:bg-[#33302d] text-white px-4 py-2 rounded-lg text-xs font-ledger transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حفظ المقطع' : 'Save Video'}</span>
                </a>
              </div>
            )}

            {!generatedVideoUrl && !isGenerating && (
              <p className="text-xs text-[#8a726c] font-editorial text-center mt-4">
                {language === 'ar'
                  ? 'انقر على "إشعال المشهد" لرؤية حركة الجمر المتصاعد وتناثر الشرر بدقة فائقة.'
                  : 'Click the button above to watch live embers and gentle oak smoke begin to curl and shimmer.'}
              </p>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
