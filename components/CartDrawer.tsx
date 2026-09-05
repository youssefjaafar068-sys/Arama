import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, MessageSquare, ArrowRight, Bike, Store } from 'lucide-react';
import { CartItem, OrderType } from '../types';
import { restaurantInfo } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onRemoveItem: (index: number) => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  orderType,
  onChangeOrderType,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? restaurantInfo.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `🍽️ *طلب جديد من مطعم آراما (${restaurantInfo.city})*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📌 *نوع الطلب:* ${orderType === 'delivery' ? '🚗 توصيل منزلي' : '🛍️ استلام من المطعم'}\n`;
    
    if (customerName) message += `👤 *الاسم:* ${customerName}\n`;
    if (customerPhone) message += `📞 *رقم الجوال:* ${customerPhone}\n`;
    if (orderType === 'delivery' && customerAddress) message += `📍 *العنوان:* ${customerAddress}\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `🛒 *تفاصيل الأصناف:*\n`;

    cartItems.forEach((cartItem, index) => {
      message += `${index + 1}. *${cartItem.item.name}* × ${cartItem.quantity} = *${cartItem.item.price * cartItem.quantity} ر.س*\n`;
      if (cartItem.notes) {
        message += `   └ 📝 ملاحظة: ${cartItem.notes}\n`;
      }
    });

    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *المجموع الفرعي:* ${subtotal} ر.س\n`;
    if (orderType === 'delivery') {
      message += `🛵 *رسوم التوصيل:* ${deliveryFee} ر.س\n`;
    }
    message += `🌟 *الإجمالي النهائي:* *${grandTotal} ر.س*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `شكراً لاختياركم مطعم آراما! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 left-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-arama-500 text-white">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black">سلة الطلبات</h2>
                <p className="text-xs text-slate-400 font-medium">{cartItems.length} أصناف في السلة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">اختر طريقة استلام الطلب:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeOrderType('delivery')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-arama-500 text-white shadow-lg shadow-arama-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>توصيل منزلي</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOrderType('pickup')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  orderType === 'pickup'
                    ? 'bg-arama-500 text-white shadow-lg shadow-arama-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>استلام من الفرع</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">سلة التسوق فارغة</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  لم تقم بإضافة أي أصناف إلى سلة التسوق بعد. تصفح المنيو واختر ما يُعجبك!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-3 rounded-xl bg-arama-500 text-white font-bold text-sm hover:bg-arama-600 transition-colors shadow-md"
                >
                  تصفح المنيو الآن
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500">الأصناف المختارة</span>
                  <button
                    onClick={onClearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إفراغ السلة</span>
                  </button>
                </div>

                {cartItems.map((cartItem, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{cartItem.item.name}</h4>
                        <span className="text-arama-600 font-black text-sm">
                          {cartItem.item.price * cartItem.quantity} ر.س
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(index, cartItem.quantity - 1)}
                          className="text-slate-600 hover:text-arama-600 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-slate-900 text-sm w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, cartItem.quantity + 1)}
                          className="text-slate-600 hover:text-arama-600 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs text-slate-500">
                        {cartItem.item.price} ر.س / للقطعة
                      </span>
                    </div>

                    {/* Special Notes Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="ملاحظات خاصة (مثال: بدون بصل، زيادة صوص...)"
                        value={cartItem.notes || ''}
                        onChange={(e) => onUpdateNotes(index, e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-araba-500 focus:ring-1 focus:ring-arama-500"
                      />
                    </div>
                  </div>
                ))}

                {/* Customer Details Form */}
                <div className="pt-4 space-y-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">بيانات العميل (لتسهيل الطلب):</h4>
                  <input
                    type="text"
                    placeholder="الاسم الكريم"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-arama-500"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الجوال (05xxxxxxxx)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-arama-500"
                  />
                  {orderType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="العنوان التفصيلي (السيح، حي العزيزية...)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-arama-500"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-900">{subtotal} ر.س</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-slate-600">
                    <span>رسوم التوصيل:</span>
                    <span className="font-bold text-slate-900">{deliveryFee} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-arama-600 text-xl">{grandTotal} ر.س</span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base hover:from-emerald-700 hover:to-emerald-600 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <MessageSquare className="w-6 h-6 fill-white text-emerald-600" />
                <span>إرسال الطلب عبر واتساب</span>
              </button>

              <p className="text-center text-xs text-slate-400">
                سيتم تحويلك مباشرة لتأكيد الطلب عبر تطبيق واتساب مع تفاصيل طلبك الكاملة.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
