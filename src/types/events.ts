import { IProduct } from './product';
import { IOrderData } from './order';
import { ICartItem } from './cart';

export interface AppEventMap {
  '*': undefined;
  'product:select': string;
  'preview:change': IProduct;
  'cart:add': string;
  'cart:remove': string;
  'cart:toggle': string;
  'cart:render': ICartItem[];
  'cart:updated': ICartItem[];
  'cart_counter:render': number;
  'modal:close': undefined;
  'order:submit': IOrderData;
  'order:payment': { method: 'card' | 'cash' };
  'order:address': { value: string };
  'order:contacts': { email: string; phone: string };
  'order:ready': undefined;
  'order:open': undefined;
  'cart:open': undefined;
  'products:loaded': IProduct[];
  'products:error': Error;
}

export type AppEvents = keyof AppEventMap;

export interface IEvent<T extends AppEvents = AppEvents> {
  type: T;
  payload?: AppEventMap[T];
}
