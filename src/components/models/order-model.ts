import { EventEmitter } from '../base/event-emitter';
import { IOrderData, ICartItem } from '../../types';

export class OrderModel {
  private order: Partial<IOrderData> = {};

  constructor(private emitter: EventEmitter) {}

  setPaymentMethod(method: 'card' | 'cash') {
    this.order.payment = method;
  }

  setAddress(address: string) {
    this.order.address = address;
  }

  setContacts(email: string, phone: string) {
    this.order.email = email;
    this.order.phone = phone;
  }

  setItems(items: ICartItem[]) {
    this.order.items = items;
  }

  clear() {
    this.order = {};
  }

  getOrder(): IOrderData {
    const { payment, address, email, phone, items } = this.order;

    if (!payment || !address || !email || !phone || !items) {
      throw new Error('Данные заказа неполные');
    }

    return {
      payment,
      address,
      email,
      phone,
      items,
    };
  }
}
