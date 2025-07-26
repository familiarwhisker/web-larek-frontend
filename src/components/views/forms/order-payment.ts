import { FormView } from './form';

export class OrderPaymentView extends FormView {
  bindEvents(): void {
    const cardBtn = this.element.querySelector('[name="card"]')!;
    const cashBtn = this.element.querySelector('[name="cash"]')!;
    const addressInput = this.element.querySelector<HTMLInputElement>('input[name="address"]')!;
    const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    let selectedMethod: 'online' | 'cash' | null = null;

    const validate = () => {
      if (selectedMethod && addressInput.value.trim()) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    };

    cardBtn.addEventListener('click', () => {
      selectedMethod = 'online';
      cardBtn.classList.add('button_alt-active');
      cashBtn.classList.remove('button_alt-active');
      this.emitter.emit('order:set_payment_method', { method: 'online' });
      validate();
    });

    cashBtn.addEventListener('click', () => {
      selectedMethod = 'cash';
      cashBtn.classList.add('button_alt-active');
      cardBtn.classList.remove('button_alt-active');
      this.emitter.emit('order:set_payment_method', { method: 'cash' });
      validate();
    });

    addressInput.addEventListener('input', () => {
      if (addressInput.value.trim()) {
        this.emitter.emit('order:set_address', { value: addressInput.value.trim() });
      }
      validate();
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emitter.emit('order:open_contacts_form');
    });
  }
}
