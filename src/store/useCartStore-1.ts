import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware"; // Import `PersistOptions` for proper typing
import { products } from "@/demo-data/data";
import { Product } from "@/types/product";

interface CartItem {
  id: number;
  quantity: number;
}

interface CartDetail {
  id: number;
  quantity: number;
  productDetails: Product;
}

interface CartStore {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  setCartItems: (newCartItems: CartItem[]) => void;
  getItemQuantity: (itemId: number) => number;
  increaseCartQuantity: (itemId: number) => void;
  decreaseCartQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  cartDetails: () => CartDetail[];
  subtotal: () => number;
}

// Type for Zustand Persist Middleware
type CartStorePersist = CartStore & {
  cartItems: CartItem[];
};

// Properly typed `persist` middleware
export const useCartStore = create<CartStore>()(
  persist<CartStorePersist>(
    (set, get) => ({
      // State
      cartItems: [],
      isCartOpen: false,

      // Actions
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setCartItems: (newCartItems: CartItem[]) =>
        set({ cartItems: newCartItems }),

      getItemQuantity: (itemId) =>
        get().cartItems.find((item) => item.id === itemId)?.quantity || 0,

      increaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { id: itemId, quantity: 1 }],
            };
          }
        }),

      decreaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem?.quantity === 1) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };
          } else {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),

      clearCart: () => set({ cartItems: [] }),

      // Derived state as functions
      cartDetails: () => {
        const cartItems = get().cartItems || [];
        return cartItems.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          if (!product)
            throw new Error(`Product with id ${cartItem.id} not found`);
          return { ...cartItem, productDetails: product };
        });
      },

      subtotal: () => {
        const cartItems = get().cartItems || [];
        return parseFloat(
          cartItems
            .reduce((acc, cartItem) => {
              const product = products.find((p) => p.id === cartItem.id);
              if (!product) return acc;
              return (
                acc +
                parseFloat(product.price.replace("$", "")) * cartItem.quantity
              );
            }, 0)
            .toFixed(2)
        );
      },
    }),
    {
      name: "cart-storage", // Key in localStorage
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ cartItems: state.cartItems }), // Only persist `cartItems`
    } as PersistOptions<CartStorePersist>
  )
);
