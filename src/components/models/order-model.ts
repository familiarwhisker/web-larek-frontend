import { EventEmitter } from '../base/event_emitter';
import { IOrderData, ICartItem } from '../../types';

export class OrderModel {
  private order: Partial<IOrderData> = {};

  constructor(private emitter: EventEmitter) {}

  // Способ оплаты: 'card' или 'cash'
  setPaymentMethod(method: 'card' | 'cash') {
    this.order.payment = method;
  }

  // Адрес
  setAddress(address: string) {
    this.order.address = address;
  }

  // Email и телефон
  setContacts(email: string, phone: string) {
    this.order.email = email;
    this.order.phone = phone;
  }

  // Корзина целиком (массив ICartItem)
  setItems(items: ICartItem[]) {
    this.order.items = items;
  }

  // Очистка данных заказа
  clear() {
    this.order = {};
  }

  // Получение финального заказа
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
