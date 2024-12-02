export interface Product {
  id: number;
  name: string;
  color: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: {
    id: number;
    name: string;
  }[];
}

export interface ProductStore {
  products: Product[];
}
