import { EventEmitter } from '../base/event-emitter';
import { IOrderData, ICartItem } from '../../types';

export class OrderModel {
  private order: Partial<IOrderData> = {};

  constructor(private emitter: EventEmitter) {}

  setPaymentMethod(method: 'online' | 'cash') {
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
    this.order.items = items.map(item => item.product.id);
    this.order.total = items.reduce((sum, item) => sum + item.product.price, 0);
  }

  clear() {
    this.order = {};
  }

  // Получение финального заказа
  getOrder(): IOrderData {
    const { payment, address, email, phone, total, items } = this.order;

    if (!payment || !address || !email || !phone || !total || !items) {
      throw new Error('Данные заказа неполные');
    }

    return {
      payment,
      address,
      email,
      phone,
      total,
      items,
    };
  }
}
