export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  variantId: string;
  variantName: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

export const CART_STORAGE_KEY = "karimli-cart";
