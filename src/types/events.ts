import { IProduct } from './product';
import { IOrderData } from './order';
import { ICartItem } from './cart';

export interface AppEventMap {
  '*': undefined;

  // Product
  'product:add_to_cart': string;
  'product:remove_from_cart': string;
  'product:select': string;
  'product:show_preview': IProduct;

  // Cart
  'cart:open_modal': undefined;
  'cart:render_counter': number;
  'cart:render_items': ICartItem[];

  // Order
  'order:open_contacts_form': undefined;
  'order:open_payment_form': undefined;
  'order:set_address': { value: string };
  'order:set_contacts': { email: string; phone: string };
  'order:set_payment_method': { method: 'online' | 'cash' };
  'order:submit_request': IOrderData;

  // Catalog
  'catalog:error': Error;
  'catalog:loaded': IProduct[];

  // Modal
  'modal:close': undefined;
}
