export interface CartInterface {
  id: string;
  products: {
    id: string;
    quantity: number;
  }[];
}
