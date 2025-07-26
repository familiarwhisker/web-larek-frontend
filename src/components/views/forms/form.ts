import { EventEmitter } from '../../base/event-emitter';

export abstract class FormView<T = unknown> {
  protected element: HTMLFormElement;

  constructor(
    protected template: HTMLTemplateElement,
    protected emitter: EventEmitter
  ) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  }

  abstract bindEvents(data?: T): void;

  render(data?: T): HTMLElement {
    this.bindEvents(data);
    return this.element;
  }

  clear(): void {
    this.element.reset();
    const errors = this.element.querySelector('.form__errors');
    if (errors) errors.textContent = '';
  }

  showError(message: string): void {
    const error = this.element.querySelector('.form__errors');
    if (error) error.textContent = message;
  }
}
