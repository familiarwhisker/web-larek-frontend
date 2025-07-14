import { ICartItem } from './cart';

export interface IOrderData {
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: ICartItem[];
}
