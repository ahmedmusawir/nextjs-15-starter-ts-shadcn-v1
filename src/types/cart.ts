interface CartItem {
  id: number;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  getItemQuantity: (itemId: number) => number;
  increaseCartQuantity: (itemId: number) => void;
  decreaseCartQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
}
