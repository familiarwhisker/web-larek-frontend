import { FormView } from './form';
import { ValidationResult } from '../../../types/validation';
import { EventEmitter } from '../../base/event-emitter';

export class OrderContactsView extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;

  constructor(protected template: HTMLTemplateElement, emitter: EventEmitter) {
    super(template, emitter);

    // Сначала инициализируем element
    this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

    this.emailInput = this.element.querySelector<HTMLInputElement>('input[name="email"]')!;
    this.phoneInput = this.element.querySelector<HTMLInputElement>('input[name="phone"]')!;
    this.submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.emailInput.addEventListener('input', () => {
      const formData = {
        email: this.emailInput.value,
        phone: this.phoneInput.value
      };
      this.emitter.emit('order:validate_contacts_form', formData);
    });

    this.phoneInput.addEventListener('input', () => {
      const formData = {
        email: this.emailInput.value,
        phone: this.phoneInput.value
      };
      this.emitter.emit('order:validate_contacts_form', formData);
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = this.emailInput.value.trim();
      const phone = this.phoneInput.value.trim();

      this.emitter.emit('order:set_contacts', { email, phone });
    });
  }

  render(): HTMLElement {
    // Очищаем форму при каждом рендере
    this.clear();
    return this.element;
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
