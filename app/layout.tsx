import './globals.css';
import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'مطعم آراما - Arama Restaurant | حفر الباطن',
  description: 'موقع طلبات مطعم آراما في حفر الباطن - أشهى المشويات على الفحم والمأكولات المتنوعة',
  keywords: 'مطعم آراما, حفر الباطن, مشويات, كباب, بينك باستا, منيو آراما, توصيل طلبات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
