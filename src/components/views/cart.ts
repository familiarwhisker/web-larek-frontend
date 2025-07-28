import { EventEmitter } from '../base/event-emitter';

export class CartView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private element: HTMLElement;
  private list: HTMLElement;
  private priceElement: HTMLElement;
  private orderButton: HTMLElement;

  constructor(template: HTMLTemplateElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.template = template;

    this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.list = this.element.querySelector('.basket__list')!;
    this.priceElement = this.element.querySelector('.basket__price')!;
    this.orderButton = this.element.querySelector('[data-order]')!;

    this.orderButton.addEventListener('click', () => {
      this.emitter.emit('order:open_payment_form');
    });
  }

  render(cards: HTMLElement[]): HTMLElement {
    this.list.replaceChildren(...cards);

    this.updateOrderButtonState(cards.length > 0);

    return this.element;
  }

  updateTotalPrice(total: number): void {
    if (this.priceElement) {
      this.priceElement.textContent = `${total} синапсов`;
    }
  }

  private updateOrderButtonState(isEnabled: boolean): void {
    if (this.orderButton) {
      if (isEnabled) {
        this.orderButton.removeAttribute('disabled');
        this.orderButton.classList.remove('button_disabled');
      } else {
        this.orderButton.setAttribute('disabled', 'disabled');
        this.orderButton.classList.add('button_disabled');
      }
    }
  }

  clear(): void {
    if (this.list) this.list.innerHTML = '';
  }
}
