import { IOrder, IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';
import { PaymentFormData, ContactsFormData, ValidationResult } from '../../types/validation';

export class OrderModel {
  private items: IProduct[] = [];
  private paymentMethod: 'online' | 'cash' | null = null;
  private address: string | null = null;
  private email: string | null = null;
  private phone: string | null = null;
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  setPaymentMethod(method: 'online' | 'cash') {
    this.paymentMethod = method;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setContacts(email: string, phone: string) {
    this.email = email;
    this.phone = phone;
  }

  setItems(items: IProduct[]) {
    this.items = items;
  }

  calculateTotalPrice() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
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
    this.items = [];
    this.paymentMethod = null;
    this.address = null;
    this.email = null;
    this.phone = null;
  }

  clearFormData() {
    // Очищаем только данные форм, оставляя товары и сумму
    this.paymentMethod = null;
    this.address = null;
    this.email = null;
    this.phone = null;
  }

  getOrder(): IOrder {
    const payment = this.paymentMethod;
    const address = this.address;
    const email = this.email;
    const phone = this.phone;
    const items = this.items.map(item => item.id);
    const total = this.calculateTotalPrice();

    if (!payment || !address || !email || !phone || total == null || !items) {
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
