import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { RESTAURANT_LOCATIONS } from '../data/restaurant-data.ts';
import { MapPin, Navigation, Compass, Send, Clock, Phone, ExternalLink, HelpCircle } from 'lucide-react';

interface GoogleMapsSectionProps {
  language: 'ar' | 'en';
}

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ language }) => {
  const [selectedLocId, setSelectedLocId] = useState(RESTAURANT_LOCATIONS[0].id);
  const [activePin, setActivePin] = useState<(typeof RESTAURANT_LOCATIONS)[0] | null>(null);
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingLoading, setGroundingLoading] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{ answer: string; chunks?: any[] } | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const activeLocation = RESTAURANT_LOCATIONS.find((l) => l.id === selectedLocId) || RESTAURANT_LOCATIONS[0];

  useEffect(() => {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey) {
      setApiKey(envKey);
    } else {
      fetch('/api/maps/config')
        .then((res) => res.json())
        .then((data) => {
          if (data.apiKey) setApiKey(data.apiKey);
        })
        .catch(() => {});
    }
  }, []);

  const handleAskGrounding = async (presetText?: string) => {
    const q = presetText || groundingQuery;
    if (!q.trim()) return;

    setGroundingLoading(true);
    setGroundingResult(null);

    try {
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          locationContext: `${activeLocation.nameEn}, ${activeLocation.city}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGroundingResult({
          answer: data.answer,
          chunks: data.groundingChunks,
        });
      } else {
        setGroundingResult({
          answer: data.error || 'Unable to retrieve location details.',
        });
      }
    } catch {
      setGroundingResult({
        answer: 'Connection error while communicating with concierge service.',
      });
    } finally {
      setGroundingLoading(false);
    }
  };

  const sampleGroundingPrompts = language === 'ar' ? [
    'ما هي أفضل طريقة للوصول إلى فرع سان سيباستيان سيراً على الأقدام من الشاطئ؟',
    'أين تتوفر مواقف السيارات القريبة من مطعم آراما؟',
    'ما هي المعالم الطبيعية والتاريخية المحيطة بالفرع المطل على البحر؟'
  ] : [
    'What is the best walking route to the San Sebastián Asador from La Concha beach?',
    'What are the nearest valet and parking options near Arama?',
    'What historic landmarks and cider cellars are within walking distance?'
  ];

  return (
    <section id="locations-map" className="py-16 border-t border-[#dec0ba]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#7b210d] font-ledger text-xs uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4 text-[#7b210d]" />
              <span>{language === 'ar' ? 'فروع آراما والوصول إلى بيت النار' : 'HEARTH LOCATIONS & VISITOR ACCESS'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[#1e1b19]">
              {language === 'ar' ? 'مواقع مشويات الفرن الحجري وخريطة الجمر' : 'Sacred Embers & Stone Hearth Locations'}
            </h2>
          </div>

          {/* Location Selection Pills */}
          <div className="flex flex-wrap gap-2">
            {RESTAURANT_LOCATIONS.map((loc) => {
              const isActive = loc.id === selectedLocId;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    setActivePin(loc);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm rounded-xl font-display transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7b210d] text-white shadow-md'
                      : 'bg-[#f4ece8] text-[#57423d] hover:bg-[#e9e1dd] border border-[#dec0ba]'
                  }`}
                >
                  {language === 'ar' ? loc.nameAr.split('·')[0].trim() + ' (' + loc.city.split(',')[0] + ')' : loc.city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Map Box */}
          <div className="lg:col-span-8 bg-[#f4ece8] rounded-2xl overflow-hidden border border-[#dec0ba] shadow-sm relative">
            <div className="h-[460px] sm:h-[500px] w-full relative">
              {apiKey ? (
                <APIProvider apiKey={apiKey}>
                  <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={{ lat: activeLocation.lat, lng: activeLocation.lng }}
                    center={{ lat: activeLocation.lat, lng: activeLocation.lng }}
                    defaultZoom={14}
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                  >
                    {RESTAURANT_LOCATIONS.map((loc) => (
                      <AdvancedMarker
                        key={loc.id}
                        position={{ lat: loc.lat, lng: loc.lng }}
                        onClick={() => setActivePin(loc)}
                      >
                        <Pin
                          background="#7b210d"
                          borderColor="#fff8f5"
                          glyphColor="#ffffff"
                          scale={1.2}
                        />
                      </AdvancedMarker>
                    ))}

                    {activePin && (
                      <InfoWindow
                        position={{ lat: activePin.lat, lng: activePin.lng }}
                        onCloseClick={() => setActivePin(null)}
                      >
                        <div className="p-2 text-right max-w-xs text-[#1e1b19] font-editorial" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                          <p className="font-bold font-display text-sm text-[#7b210d] mb-1">
                            {language === 'ar' ? activePin.nameAr : activePin.nameEn}
                          </p>
                          <p className="text-xs text-[#57423d] mb-2">{language === 'ar' ? activePin.addressAr : activePin.addressEn}</p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${activePin.lat},${activePin.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#7b210d] underline font-semibold"
                          >
                            <span>{language === 'ar' ? 'عرض على خرائط Google' : 'Open in Google Maps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                <div className="w-full h-full bg-[#1e1b19] text-[#fff8f5] flex flex-col justify-between p-7 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffc1b4_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex items-center justify-between border-b border-[#57423d] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#a23d27] animate-pulse" />
                      <span className="font-ledger text-xs text-[#dec0ba]">
                        {activeLocation.lat.toFixed(4)}° N, {activeLocation.lng.toFixed(4)}° E
                      </span>
                    </div>
                    <span className="bg-[#7b210d] px-3 py-1 text-xs font-display text-white rounded-lg">
                      {activeLocation.city}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#9b3822]/40 border border-[#a23d27] flex items-center justify-center text-[#ffc1b4]">
                      <MapPin className="w-8 h-8 text-[#ffb4a3] animate-bounce" />
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                      {language === 'ar' ? activeLocation.nameAr : activeLocation.nameEn}
                    </h3>
                    <p className="font-editorial text-base text-[#dec0ba] max-w-md mx-auto">
                      {language === 'ar' ? activeLocation.addressAr : activeLocation.addressEn}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs text-[#dec0ba] border-t border-[#57423d] pt-3">
                    <div className="flex items-center gap-1.5 font-editorial">
                      <Clock className="w-4 h-4 text-[#ffc1b4]" />
                      <span>{activeLocation.hours}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.lat},${activeLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#7b210d] hover:bg-[#9b3822] text-white px-4 py-2 rounded-lg transition text-xs font-display font-semibold"
                    >
                      <span>{language === 'ar' ? 'مسار الاتجاهات الحية' : 'Live Directions'}</span>
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Location Bar below map */}
            <div className="p-4 sm:p-5 bg-[#fff8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm border-t border-[#dec0ba]">
              <div className="flex items-start sm:items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#7b210d] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-bold text-[#1e1b19] font-display">
                    {language === 'ar' ? activeLocation.nameAr : activeLocation.nameEn}:
                  </span>{' '}
                  <span className="text-[#57423d] font-editorial">{language === 'ar' ? activeLocation.addressAr : activeLocation.addressEn}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`tel:${activeLocation.phone}`}
                  className="flex items-center gap-1.5 text-[#7b210d] hover:underline font-ledger text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{activeLocation.phone}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.lat},${activeLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#1e1b19] text-white px-3.5 py-2 rounded-lg text-xs font-display font-semibold hover:bg-[#33302d]"
                >
                  <span>{language === 'ar' ? 'عرض على الخريطة' : 'View on Map'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Maps Grounding Concierge */}
          <div className="lg:col-span-4 bg-[#fff8f5] rounded-2xl border border-[#dec0ba] p-6 shadow-sm flex flex-col min-h-[460px]">
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-[#dec0ba]">
              <div className="p-2 bg-[#7b210d]/10 text-[#7b210d] rounded-xl">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#1e1b19]">
                  {language === 'ar' ? 'مرشد آراما لمسارات الوصول والمواقف' : 'Arama Arrival & Route Guide'}
                </h3>
                <p className="text-xs text-[#8a726c] font-editorial">
                  {language === 'ar' ? 'معلومات حية ودقيقة عن الموقع' : 'Real-time location & access info'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#57423d] font-editorial mb-4 leading-relaxed">
              {language === 'ar'
                ? 'استعلم فوراً عن تفاصيل الوصول، أقرب المواقف، المسارات الساحلية، وأفضل الأوقات للزيارة.'
                : 'Ask about walking paths from coastal promenades, parking availability, and scenic route recommendations.'}
            </p>

            {/* Prompt presets */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-display font-bold text-[#57423d] block">
                {language === 'ar' ? 'أسئلة الضيوف المتكررة:' : 'Common Arrival Queries:'}
              </span>
              {sampleGroundingPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setGroundingQuery(prompt);
                    handleAskGrounding(prompt);
                  }}
                  className="w-full text-right p-2.5 rounded-xl text-xs bg-[#f4ece8] hover:bg-[#e9e1dd] text-[#1e1b19] font-editorial border border-[#dec0ba]/60 transition text-ellipsis overflow-hidden cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Query Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskGrounding();
              }}
              className="mt-auto pt-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={groundingQuery}
                  onChange={(e) => setGroundingQuery(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'اسأل عن الوصول، المواقف، أو المعالم القريبة...'
                      : 'Ask about parking, walking routes, or landmarks...'
                  }
                  className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded-xl px-3.5 py-3 text-xs text-[#1e1b19] focus:outline-none focus:border-[#7b210d] pr-9 font-editorial"
                />
                <button
                  type="submit"
                  disabled={groundingLoading || !groundingQuery.trim()}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7b210d] hover:text-[#9b3822] disabled:opacity-30 p-1 cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {groundingLoading && (
              <div className="mt-3.5 p-3 bg-[#faf2ee] rounded-xl border border-[#dec0ba] text-xs text-[#57423d] flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#7b210d] border-t-transparent rounded-full animate-spin" />
                <span className="font-editorial">{language === 'ar' ? 'جاري التحقق من مسارات الوصول الحية...' : 'Checking real-time route details...'}</span>
              </div>
            )}

            {groundingResult && (
              <div className="mt-3.5 p-4 bg-[#f4ece8] rounded-xl border border-[#dec0ba] text-xs text-[#1e1b19] max-h-56 overflow-y-auto">
                <p className="font-editorial leading-relaxed whitespace-pre-wrap">{groundingResult.answer}</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
