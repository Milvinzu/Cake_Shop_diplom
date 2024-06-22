export interface Product {
  _id: string;
  img: string | File;
  name: string;
  price: number;
  description: string;
  weight: string | string[];
  category: string | null;
}

export interface RegularProduct {
  _id?: string;
  category: string;
  name: string;
  description: string;
  weight: string;
  price: number;
  img: File | string;
}

export interface ShablonCake {
  _id?: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  img: File;
}

export interface Taste {
  _id?: string;
  cakeId: string;
  name: string;
  description: string;
  img: File;
}
