import { FormView } from './form';
import { IOrderData } from '../../../types/order';

export class OrderPaymentView extends FormView {
  bindEvents(data?: IOrderData): void {
    const cardBtn = this.element.querySelector('[name="card"]')!;
    const cashBtn = this.element.querySelector('[name="cash"]')!;
    const addressInput = this.element.querySelector<HTMLInputElement>('input[name="address"]')!;
    const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    let selectedMethod: 'card' | 'cash' | null = null;

    const validate = () => {
      if (selectedMethod && addressInput.value.trim()) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    };

    cardBtn.addEventListener('click', () => {
      selectedMethod = 'card';
      this.emitter.emit('order:payment', { method: 'card' });
      validate();
    });

    cashBtn.addEventListener('click', () => {
      selectedMethod = 'cash';
      this.emitter.emit('order:payment', { method: 'cash' });
      validate();
    });

    addressInput.addEventListener('input', () => {
      if (addressInput.value.trim()) {
        this.emitter.emit('order:address', { value: addressInput.value.trim() });
      }
      validate();
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emitter.emit('order:ready');
    });
  }
}
