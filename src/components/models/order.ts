import { IOrder, IProduct } from '../../types';

export class OrderModel {
  private order: Partial<IOrder> = {};

  constructor() {}

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

  setItems(items: IProduct[]) {
    this.order.items = items.map(item => item.id);
    this.order.total = items.reduce((sum, item) => sum + item.price, 0);
  }

  clear() {
    this.order = {};
  }

  getOrder(): IOrder {
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
