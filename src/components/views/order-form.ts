import { IOrderData } from '../../types';
import { IView } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class OrderFormView implements IView<IOrderData> {
  private step = 0;
  private elements: Record<string, HTMLElement | null> = {};

  constructor(private container: HTMLElement, private emitter: EventEmitter) {}

  render(data: IOrderData): void {
    // Пока заглушка — заменим при реальной отрисовке
    console.log('Rendering order form with data:', data);
  }

  clear(): void {
    this.container.innerHTML = '';
    this.step = 0;
  }

  private handleNextStep(): void {
    const form = this.container.querySelector('form');
    if (!form) return;

    switch (this.step) {
      case 0: {
        const method = form.querySelector<HTMLInputElement>(
          'input[name="payment"]:checked'
        )?.value as 'card' | 'cash';
        if (!method) return;
        this.emitter.emit('order:payment', { method });
        break;
      }

      case 1: {
        const address = form.querySelector<HTMLInputElement>(
          'input[name="address"]'
        )?.value;
        if (!address?.trim()) {
          this.showError('Необходимо указать адрес');
          return;
        }
        this.emitter.emit('order:address', { value: address.trim() });
        break;
      }

      case 2: {
        const email = form.querySelector<HTMLInputElement>(
          'input[name="email"]'
        )?.value;
        const phone = form.querySelector<HTMLInputElement>(
          'input[name="phone"]'
        )?.value;
        if (!email || !phone) {
          this.showError('Укажите email и телефон');
          return;
        }
        this.emitter.emit('order:contacts', { email, phone });
        break;
      }

      case 3: {
        this.emitter.emit('order:ready');
        return;
      }
    }

    this.step++;
    this.renderStep();
  }

  private renderStep(): void {
    const steps = [
      this.renderPaymentStep,
      this.renderAddressStep,
      this.renderContactStep,
      this.renderSubmitStep,
    ];
    this.container.innerHTML = '';
    steps[this.step].call(this);
  }

  private renderPaymentStep(): void {
    // render payment step
  }

  private renderAddressStep(): void {
    // render address step
  }

  private renderContactStep(): void {
    // render contact step
  }

  private renderSubmitStep(): void {
    // render submit step
  }

  private showError(message: string) {
    const error = document.createElement('p');
    error.textContent = message;
    error.style.color = 'red';
    this.container.appendChild(error);
  }
}
