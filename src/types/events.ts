import { IProduct } from './product';
import { IOrderData } from './order';
import { ICartItem } from './cart';


export interface AppEventMap {
  '*': undefined;
  'product:select': IProduct;
  'preview:change': IProduct;
  'cart:add': IProduct;
  'cart:remove': IProduct;
  'cart:render': ICartItem[];
  'cart_counter:render': number;
  'modal:close': undefined;
  'order:submit': IOrderData;
  'order:payment': { method: 'card' | 'cash' };
  'order:address': { value: string };
  'order:contacts': { email: string; phone: string };
  'order:ready': undefined;
  'order:open': undefined;
  'cart:open': undefined;

}


export type AppEvents = keyof AppEventMap;

export interface IEvent<T extends AppEvents = AppEvents> {
  type: T;
  payload?: AppEventMap[T];
}
