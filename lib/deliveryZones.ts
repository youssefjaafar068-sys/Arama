// مناطق التوصيل في حفر الباطن — بدون أي ذكاء اصطناعي، فحص نصي مباشر.

export const SUPPORTED_DISTRICTS = [
  'الخالدية',
  'العزيزية',
  'الفيصلية',
  'البلدية',
  'النزهة',
  'أبو موسى الأشعري',
  'ابو موسى الاشعري',
  'ابو موسى',
  'أبو موسى',
  'الربوة',
  'السليمانية',
  'الروضة',
  'الشفاء',
  'المحمدية',
  'الواحة',
  'الريان',
  'النرجس',
  'الورود',
  'اليرموك',
  'الصناعية',
  'الفيحاء',
  'التلال',
  'الربيع',
  'الإسكان',
  'اسكان',
  'غرناطة',
  'الوادي',
  'المروج',
  'الفضل',
  'الباطن',
  'المطار القديم'
];

export const OUT_OF_ZONE_AREAS = [
  'القيصومة',
  'الذيبية',
  'الصداوي',
  'السعيرة',
  'الصفيري',
  'ام قليب',
  'أم قليب',
  'الرقعي',
  'الرياض',
  'الدمام',
  'الخبر',
  'جدة',
  'مكة',
  'المدينة',
  'بريدة',
  'عنيزة',
  'تبوك',
  'حائل',
  'الجبيل',
  'الأحساء',
  'خارج حفر الباطن',
  'حي غير معروف',
  'منطقة بعيدة'
];

export function evaluateLocation(locationInput: string): {
  isDetermined: boolean;
  isSupported: boolean;
  districtName: string;
} {
  const cleanInput = locationInput.trim().toLowerCase();

  for (const outArea of OUT_OF_ZONE_AREAS) {
    if (cleanInput.includes(outArea.toLowerCase())) {
      return { isDetermined: true, isSupported: false, districtName: outArea };
    }
  }

  if (
    cleanInput.includes('خارج') ||
    cleanInput.includes('مدينة ثانية') ||
    cleanInput.includes('الرياض') ||
    cleanInput.includes('الشرقية') ||
    cleanInput.includes('الدمام')
  ) {
    return { isDetermined: true, isSupported: false, districtName: locationInput };
  }

  for (const district of SUPPORTED_DISTRICTS) {
    if (cleanInput.includes(district.toLowerCase())) {
      return { isDetermined: true, isSupported: true, districtName: district };
    }
  }

  if (
    cleanInput === 'حفر الباطن' ||
    cleanInput === 'الحفر' ||
    cleanInput === 'في حفر الباطن' ||
    cleanInput === 'في الحفر'
  ) {
    return { isDetermined: false, isSupported: false, districtName: '' };
  }

  return { isDetermined: false, isSupported: false, districtName: locationInput };
}
