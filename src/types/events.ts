import { IProduct } from './product';
import { IOrderData } from './order';

export interface AppEventMap {
  '*': undefined; // Global event
  'product:select': IProduct;
  'cart:add': IProduct;
  'cart:remove': IProduct;
  'modal:open': undefined;
  'modal:close': undefined;
  'order:submit': IOrderData;
  'order:payment': { method: 'card' | 'cash' };
  'order:address': { value: string };
  'order:contacts': { email: string; phone: string };
  'order:ready': undefined;
}

export type AppEvents = keyof AppEventMap;

export interface IEvent<T extends AppEvents = AppEvents> {
  type: T;
  payload?: AppEventMap[T];
}
