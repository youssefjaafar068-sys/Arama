import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, OrderType } from '../types';
import { menuItems as initialMenuItems } from '../data/mockData';

interface AppState {
  // Menu State
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  updateItemImage: (id: string, newImage: string) => void;
  resetMenu: () => void;

  // Cart State
  cartItems: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  addToCart: (item: MenuItem) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateNotes: (index: number, notes: string) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  syncCart: (items: CartItem[]) => void;

  // Customer Info State
  customerDistrict: string;
  customerName: string;
  customerPhone: string;
  customerDetailedAddress: string;
  setCustomerInfo: (info: Partial<{
    customerDistrict: string;
    customerName: string;
    customerPhone: string;
    customerDetailedAddress: string;
  }>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Menu Initial State
      menuItems: initialMenuItems,
      setMenuItems: (items) => set({ menuItems: items }),
      updateItemImage: (id, newImage) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, image: newImage } : item
          ),
        })),
      resetMenu: () => set({ menuItems: initialMenuItems }),

      // Cart Initial State
      cartItems: [],
      orderType: 'delivery',
      setOrderType: (type) => set({ orderType: type }),

      addToCart: (item) =>
        set((state) => {
          const existingIndex = state.cartItems.findIndex((ci) => ci.item.id === item.id);
          if (existingIndex > -1) {
            const updated = [...state.cartItems];
            updated[existingIndex].quantity += 1;
            return { cartItems: updated };
          }
          return { cartItems: [...state.cartItems, { item, quantity: 1, notes: '' }] };
        }),

      updateQuantity: (index, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cartItems: state.cartItems.filter((_, i) => i !== index) };
          }
          const updated = [...state.cartItems];
          updated[index].quantity = quantity;
          return { cartItems: updated };
        }),

      updateNotes: (index, notes) =>
        set((state) => {
          const updated = [...state.cartItems];
          updated[index].notes = notes;
          return { cartItems: updated };
        }),

      removeItem: (index) =>
        set((state) => ({
          cartItems: state.cartItems.filter((_, i) => i !== index),
        })),

      clearCart: () => set({ cartItems: [] }),

      syncCart: (items) =>
        set((state) => {
          // Merge items
          const newCart = [...state.cartItems];
          items.forEach(newItem => {
            const existingIndex = newCart.findIndex(ci => ci.item.id === newItem.item.id);
            if (existingIndex > -1) {
               newCart[existingIndex].quantity += newItem.quantity;
            } else {
               newCart.push(newItem);
            }
          });
          return { cartItems: newCart };
        }),

      // Customer Info Initial State
      customerDistrict: '',
      customerName: '',
      customerPhone: '',
      customerDetailedAddress: '',
      setCustomerInfo: (info) => set((state) => ({ ...state, ...info })),
    }),
    {
      name: 'arama-storage', // name of the item in the storage
      partialize: (state) => ({
        cartItems: state.cartItems,
        orderType: state.orderType,
        customerDistrict: state.customerDistrict,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerDetailedAddress: state.customerDetailedAddress,
        menuItems: state.menuItems,
      }),
    }
  )
);
