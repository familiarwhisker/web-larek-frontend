import { FormView } from './form';
import { IOrderData } from '../../../types/order';


export class OrderContactsView extends FormView {
  bindEvents(data?: IOrderData): void {
    const emailInput = this.element.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phoneInput = this.element.querySelector<HTMLInputElement>('input[name="phone"]')!;
    const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    const validate = () => {
      if (emailInput.value && phoneInput.value) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    };

    emailInput.addEventListener('input', validate);
    phoneInput.addEventListener('input', validate);

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!email || !phone) {
        this.showError('Укажите email и телефон');
        return;
      }

      this.emitter.emit('order:contacts', { email, phone });
      this.emitter.emit('order:submit');
    });
  }
}
