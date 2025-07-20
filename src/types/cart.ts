import { IProduct } from './product';

// Cart element
export interface ICartItem {
  product: IProduct;
  quantity: number;
}
