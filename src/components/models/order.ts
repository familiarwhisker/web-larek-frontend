import { IOrder, IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';
import { PaymentFormData, ContactsFormData, ValidationResult } from '../../types/validation';

export class OrderModel {
  private order: Partial<IOrder> = {};
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

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

  validatePaymentForm(data: PaymentFormData): ValidationResult {
    const errors: string[] = [];

    if (!data.paymentMethod) {
      errors.push('Выберите способ оплаты');
    }

    if (!data.address.trim()) {
      errors.push('Укажите адрес доставки');
    }

    const isValid = errors.length === 0;
    const submitButtonDisabled = !isValid;

    return {
      isValid,
      errors,
      submitButtonDisabled
    };
  }

  validateContactsForm(data: ContactsFormData): ValidationResult {
    const errors: string[] = [];

    if (!data.email.trim()) {
      errors.push('Укажите email');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Укажите корректный email');
    }

    if (!data.phone.trim()) {
      errors.push('Укажите телефон');
    } else if (!this.isValidPhone(data.phone)) {
      errors.push('Укажите корректный номер телефона');
    }

    const isValid = errors.length === 0;
    const submitButtonDisabled = !isValid;

    return {
      isValid,
      errors,
      submitButtonDisabled
    };
  }

  private isValidEmail(email: string): boolean {
    return email.trim().length > 0;
  }

  private isValidPhone(phone: string): boolean {
    return phone.trim().length > 0;
  }

  clear() {
    this.order = {};
  }

  clearFormData() {
    // Очищаем только данные форм, оставляя товары и сумму
    this.order.payment = undefined;
    this.order.address = undefined;
    this.order.email = undefined;
    this.order.phone = undefined;
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
