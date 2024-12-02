import { create } from "zustand";
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
  products: Product[];
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  setCartItems: (newCartItems: CartItem[]) => void;
  getItemQuantity: (itemId: number) => number;
  increaseCartQuantity: (itemId: number) => void;
  decreaseCartQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  cartDetails: CartDetail[];
  subtotal: number;
}

export const useCartStore = create<CartStore>((set, get) => {
  // Memoized derived state
  // const computeCartDetails = () => {
  //   const cartItems = get().cartItems || []; // Safeguard: use empty array if undefined
  //   return cartItems.map((cartItem) => {
  //     const product = products.find((p) => p.id === cartItem.id);
  //     if (!product) throw new Error(`Product with id ${cartItem.id} not found`);
  //     return { ...cartItem, productDetails: product };
  //   });
  // };
  const computeCartDetails = () => {
    const { cartItems, products } = get(); // Access both cartItems and products
    return cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) throw new Error(`Product with id ${cartItem.id} not found`);
      return { ...cartItem, productDetails: product };
    });
  };

  // const computeSubtotal = () => {
  //   const cartItems = get().cartItems || []; // Ensure cartItems is always an array
  //   return cartItems.reduce((acc, cartItem) => {
  //     const product = products.find((p) => p.id === cartItem.id);
  //     if (!product) return acc;
  //     return (
  //       acc + parseFloat(product.price.replace("$", "")) * cartItem.quantity
  //     );
  //   }, 0);
  // };

  const computeSubtotal = () => {
    const { cartItems, products } = get();
    return cartItems.reduce((acc, cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return acc;
      return (
        acc + parseFloat(product.price.replace("$", "")) * cartItem.quantity
      );
    }, 0);
  };

  return {
    // State
    products,
    cartItems: [],
    isCartOpen: false,

    // Actions
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    // setCartItems: (newCartItems) => set({ cartItems: newCartItems }),
    setCartItems: (newCartItems: CartItem[]) =>
      set({ cartItems: newCartItems }),

    getItemQuantity: (itemId) =>
      get().cartItems.find((item) => item.id === itemId)?.quantity || 0,

    increaseCartQuantity: (itemId) =>
      set((state) => {
        const existingItem = state.cartItems.find((item) => item.id === itemId);
        if (existingItem) {
          console.log("Updating quantity for item:", itemId);
          console.log("Before update:", state.cartItems);
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          console.log("Adding new item to cart:", itemId);
          console.log("Cart Item:", state.cartItems);
          const newCartItems = [
            ...state.cartItems,
            { id: itemId, quantity: 1 },
          ];
          console.log("After add:", newCartItems); // Debug
          return {
            cartItems: newCartItems,
          };
          // return {
          //   cartItems: [...state.cartItems, { id: itemId, quantity: 1 }],
          // };
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

    // Derived state as getters
    get cartDetails() {
      return computeCartDetails();
    },
    get subtotal() {
      return computeSubtotal();
    },
  };
});
