import React, { useState } from 'react';
import { OrderItem, calculateOrderSummary } from '../utils/culinary-logic.ts';
import { X, Flame, Trash2, CheckCircle2, ShoppingBag, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onClearOrder: () => void;
  language: 'ar' | 'en';
}

export const OrderTrayModal: React.FC<OrderTrayModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  onUpdateQuantity,
  onClearOrder,
  language,
}) => {
  const [tableNumber, setTableNumber] = useState('Table 7');
  const [guestNotes, setGuestNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const summary = calculateOrderSummary(orderItems);

  const handleConfirmOrder = () => {
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7b210d', '#9b3822', '#5b614d', '#ffc1b4'],
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-[#fff8f5] w-full max-w-lg rounded-2xl border border-[#dec0ba] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#faf2ee] border-b border-[#dec0ba] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#7b210d] text-white rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1e1b19]">
                {language === 'ar' ? 'صينية مائدة آراما والوليمة' : 'Arama Feast & Hearth Tray'}
              </h3>
              <p className="font-ledger text-xs text-[#8a726c]">
                {summary.itemCount} {language === 'ar' ? 'أصناف محددة' : 'items selected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#57423d] hover:text-[#1e1b19] rounded-lg hover:bg-[#e9e1dd] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-2xl font-bold text-[#1e1b19]">
                {language === 'ar' ? 'تم إرسال طلبكم إلى بيت النار!' : 'Sent to Master Parrillero!'}
              </h4>
              <p className="font-editorial text-sm text-[#57423d] max-w-xs mx-auto">
                {language === 'ar'
                  ? `يجري الآن تسخين الجمر ووضع الأطباق على نار هادئة. الوقت التقديري للتقديم: ${summary.estimatedPrepMinutes} دقيقة.`
                  : `Embers are stoked and clay pots are sealed. Estimated hearth prep: ${summary.estimatedPrepMinutes} mins.`}
              </p>
              <button
                onClick={() => {
                  onClearOrder();
                  setIsSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 bg-[#7b210d] text-white rounded-lg font-ledger text-xs uppercase"
              >
                {language === 'ar' ? 'إغلاق ومتابعة الاستكشاف' : 'Close and Continue'}
              </button>
            </div>
          ) : orderItems.length === 0 ? (
            <div className="py-12 text-center text-[#8a726c] space-y-2">
              <Flame className="w-10 h-10 text-[#dec0ba] mx-auto" />
              <p className="font-display text-base text-[#1e1b19]">
                {language === 'ar' ? 'صينيتكم فارغة حالياً' : 'Your feast tray is empty'}
              </p>
              <p className="font-editorial text-xs text-[#57423d]">
                {language === 'ar'
                  ? 'تصفح قائمة مشويات الفحم وأطباق الفرن الحجري لإضافة أطايب الطعام.'
                  : 'Browse the ember grill and stone oven menu to curate your feast.'}
              </p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-2.5 divide-y divide-[#dec0ba]/40">
                {orderItems.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-12 h-12 rounded-lg object-cover border border-[#dec0ba] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-xs sm:text-sm text-[#1e1b19] truncate">
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </p>
                      <p className="text-[11px] font-ledger text-[#7b210d]">
                        ${item.price} × {quantity} = ${item.price * quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                        className="w-7 h-7 bg-[#f4ece8] hover:bg-[#e9e1dd] text-[#1e1b19] rounded flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-ledger text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                        className="w-7 h-7 bg-[#f4ece8] hover:bg-[#e9e1dd] text-[#1e1b19] rounded flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 0)}
                        className="p-1 text-[#ba1a1a] hover:bg-red-50 rounded"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table / Notes */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#dec0ba]">
                <div>
                  <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                    {language === 'ar' ? 'رقم الطاولة / الحجز:' : 'Table / Booking:'}
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded px-3 py-1.5 text-xs text-[#1e1b19] font-editorial focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                    {language === 'ar' ? 'الوقت التقديري:' : 'Estimated Hearth Prep:'}
                  </label>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4ece8] rounded border border-[#dec0ba] text-xs font-ledger text-[#57423d]">
                    <Clock className="w-3.5 h-3.5 text-[#7b210d]" />
                    <span>~{summary.estimatedPrepMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Special instruction */}
              <div>
                <label className="block text-[11px] font-ledger text-[#8a726c] uppercase mb-1">
                  {language === 'ar' ? 'ملاحظات الشيف ومستوى الملح/الجمر:' : 'Special Chef Notes:'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: رشة ملح خشن خفيف، استواء سريل...' : 'e.g. extra flaky salt on Txuleta...'}
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  className="w-full bg-[#f4ece8] border border-[#dec0ba] rounded px-3 py-1.5 text-xs text-[#1e1b19] font-editorial focus:outline-none"
                />
              </div>

              {/* Financial Breakdown */}
              <div className="p-3.5 bg-[#faf2ee] rounded-xl border border-[#dec0ba] space-y-1.5 text-xs font-editorial">
                <div className="flex justify-between text-[#57423d]">
                  <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-ledger">${summary.subtotal}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-[#5b614d]">
                    <span>{language === 'ar' ? 'خصم الوليمة الكبرى (10%):' : 'Grand Banquet Discount (10%):'}</span>
                    <span className="font-ledger">-${summary.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#57423d]">
                  <span>{language === 'ar' ? 'ضريبة الضيافة والخدمة (5%):' : 'Hospitality Service Tax (5%):'}</span>
                  <span className="font-ledger">${summary.serviceTax}</span>
                </div>
                <div className="pt-2 border-t border-[#dec0ba] flex justify-between font-bold text-sm text-[#7b210d]">
                  <span className="font-display">{language === 'ar' ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                  <span className="font-ledger text-base">${summary.total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSubmitted && orderItems.length > 0 && (
          <div className="p-4 bg-[#faf2ee] border-t border-[#dec0ba] flex items-center justify-between gap-3">
            <button
              onClick={onClearOrder}
              className="text-xs text-[#8a726c] hover:text-[#ba1a1a] font-ledger"
            >
              {language === 'ar' ? 'تفريغ الصينية' : 'Clear Tray'}
            </button>
            <button
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 bg-[#7b210d] hover:bg-[#9b3822] text-white rounded-lg font-ledger text-xs uppercase tracking-wider font-bold shadow transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-[#ffc1b4]" />
              <span>{language === 'ar' ? 'تأكيد وإشعال الجمر ($' + summary.total + ')' : 'Confirm Feast ($' + summary.total + ')'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
