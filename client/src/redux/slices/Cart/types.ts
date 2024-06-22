export interface Product {
  _id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  chocolateWords: string;
  photo: string;
  price: number;
  weight: string;
  quantity: number;
  category: string;
  uniqueKey: string;
}

export interface CartState {
  items: Product[];
}
