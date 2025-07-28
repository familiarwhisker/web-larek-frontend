import { FormView } from './form';
import { ValidationResult } from '../../../types/validation';
import { EventEmitter } from '../../base/event-emitter';

export class OrderPaymentView extends FormView {
  private cardBtn: HTMLElement;
  private cashBtn: HTMLElement;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private selectedMethod: 'online' | 'cash' | null = null;

  constructor(protected template: HTMLTemplateElement, emitter: EventEmitter) {
    super(template, emitter);

    // Сначала инициализируем element
    this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

    this.cardBtn = this.element.querySelector('[name="card"]')!;
    this.cashBtn = this.element.querySelector('[name="cash"]')!;
    this.addressInput = this.element.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.cardBtn.addEventListener('click', () => {
      this.selectedMethod = 'online';
      this.updatePaymentButtons();
      this.emitter.emit('order:set_payment_method', { method: 'online' });
      this.validateForm();
    });

    this.cashBtn.addEventListener('click', () => {
      this.selectedMethod = 'cash';
      this.updatePaymentButtons();
      this.emitter.emit('order:set_payment_method', { method: 'cash' });
      this.validateForm();
    });

    this.addressInput.addEventListener('input', () => {
      if (this.addressInput.value.trim()) {
        this.emitter.emit('order:set_address', { value: this.addressInput.value.trim() });
      }
      this.validateForm();
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emitter.emit('order:open_contacts_form');
    });
  }

  render(): HTMLElement {
    // Очищаем форму при каждом рендере
    this.clear();
    this.selectedMethod = null;
    this.updatePaymentButtons();
    return this.element;
  }

  private updateTotalPrice(price: number): void {
    const totalPrice = this.element.querySelector('.order-payment__total-price');
    if (totalPrice) {
      totalPrice.textContent = price.toString();
    }
  }

  private updatePaymentButtons(): void {
    // Сбрасываем активное состояние всех кнопок
    this.cardBtn.classList.remove('button_alt-active');
    this.cashBtn.classList.remove('button_alt-active');

    // Устанавливаем активное состояние только для выбранной кнопки
    if (this.selectedMethod === 'online') {
      this.cardBtn.classList.add('button_alt-active');
    } else if (this.selectedMethod === 'cash') {
      this.cashBtn.classList.add('button_alt-active');
    }
  }

  private validateForm(): void {
    const formData = {
      paymentMethod: this.selectedMethod,
      address: this.addressInput.value
    };

    this.emitter.emit('order:validate_payment_form', formData);
  }

  updateValidationResult(result: ValidationResult): void {
    // Обновляем состояние кнопки сабмита
    this.submitBtn.disabled = result.submitButtonDisabled;

    // Обновляем стили кнопки в зависимости от состояния
    if (result.submitButtonDisabled) {
      this.submitBtn.classList.add('button_disabled');
    } else {
      this.submitBtn.classList.remove('button_disabled');
    }

    // Показываем ошибки, если есть
    if (result.errors.length > 0) {
      this.showError(result.errors.join(', '));
    } else {
      this.showError('');
    }
  }
}
