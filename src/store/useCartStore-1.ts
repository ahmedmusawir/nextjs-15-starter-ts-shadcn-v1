import { create } from "zustand";
import Cart from "@/components/cart/Cart";
import { products } from "@/demo-data/data";

export const useCartStore = create<CartStore>((set, get) => ({
  // State
  cartItems: [],
  isCartOpen: false,

  // Actions
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setCartItems: (newCartItems) => set({ cartItems: newCartItems }),

  getItemQuantity: (itemId) =>
    get().cartItems.find((item) => item.id === itemId)?.quantity || 0,

  increaseCartQuantity: (itemId) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === itemId);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return { cartItems: [...state.cartItems, { id: itemId, quantity: 1 }] };
      }
    }),

  decreaseCartQuantity: (itemId) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === itemId);
      if (existingItem?.quantity === 1) {
        return {
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        };
      } else {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
          ),
        };
      }
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== itemId),
    })),

  clearCart: () => set({ cartItems: [] }),

  // Selectors (Derived State)
  cartDetails: () => {
    const cartItems = get().cartItems;
    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (!product) return null; // Skip invalid products
        return { ...cartItem, productDetails: product };
      })
      .filter(Boolean) as CartDetail[]; // Remove null values
  },

  subtotal: () => {
    const cartItems = get().cartItems;
    return cartItems.reduce((acc, cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return acc;
      return (
        acc + parseFloat(product.price.replace("$", "")) * cartItem.quantity
      );
    }, 0);
  },
}));
