import { IProduct } from './product';
import { IOrder } from './order';
import { PaymentFormData, ContactsFormData, ValidationResult } from './validation';

export interface IEvent {
  '*': undefined;

  'products:loaded': undefined;
  'products:loading_error': Error;

  'product:add_to_cart': string;
  'product:remove_from_cart': string;
  'product:select': string;
  'product:show_preview': IProduct;

  'cart:open_modal': undefined;
  'cart:render_counter': number;
  'cart:render_items': IProduct[];

  'order:open_contacts_form': undefined;
  'order:open_payment_form': undefined;
  'order:set_address': { value: string };
  'order:set_contacts': { email: string; phone: string };
  'order:set_payment_method': { method: 'online' | 'cash' };
  'order:submit_request': IOrder;
  'order:validate_payment_form': PaymentFormData;
  'order:validate_contacts_form': ContactsFormData;
  'order:payment_validation_result': ValidationResult;
  'order:contacts_validation_result': ValidationResult;

  'modal:close': undefined;
}
