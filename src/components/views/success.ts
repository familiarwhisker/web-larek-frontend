import { EventEmitter } from '../base/event-emitter';

export class SuccessView {
  private template: HTMLTemplateElement;
  private total: number;
  private emitter: EventEmitter;

  constructor(total: number, emitter: EventEmitter) {
    this.emitter = emitter;
    this.template = document.querySelector('#success') as HTMLTemplateElement;
    this.total = total;
  }

  render(): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const closeBtn = el.querySelector('.order-success__close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      this.emitter.emit('modal:close');
    });
    const desc = el.querySelector('.order-success__description');
    if (desc) {
      desc.textContent = `Списано ${this.total} синапсов`;
    }
    return el;
  }
}
