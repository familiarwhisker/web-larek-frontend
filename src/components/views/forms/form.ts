import { EventEmitter } from '../../base/event-emitter';

export abstract class FormView<T = unknown> {
  protected element: HTMLFormElement;
  protected emitter: EventEmitter;

  constructor(protected template: HTMLTemplateElement, emitter: EventEmitter) {
    this.emitter = emitter;
  }

  abstract bindEvents(data?: T): void;

  render(data?: T): HTMLElement {
    this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
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
