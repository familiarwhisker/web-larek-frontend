import { IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';

export class CartView {
  private emitter: EventEmitter;

  constructor(private container: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
  }

  render(data: IProduct[]): HTMLElement {
    const template = document.querySelector('#basket') as HTMLTemplateElement;

    if (!template) {
      console.error('Cart template not found!');
      return document.createElement('div');
    }

    const cartFragment = template.content.cloneNode(true) as HTMLElement;

    const list = cartFragment.querySelector('.basket__list') as HTMLElement;
    const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

    if (!itemTemplate) {
      console.error('Cart item template not found!');
      return document.createElement('div');
    }

    list.innerHTML = '';

    data.forEach((item, index) => {
      const itemNode = itemTemplate.content.cloneNode(true) as HTMLElement;

      const title = itemNode.querySelector('.card__title');
      const price = itemNode.querySelector('.card__price');
      const indexEl = itemNode.querySelector('.basket__item-index');
      const deleteBtn = itemNode.querySelector('.basket__item-delete');

      if (title) title.textContent = item.title;
      if (price) price.textContent = `${item.price} синапсов`;
      if (indexEl) indexEl.textContent = (index + 1).toString();

      deleteBtn?.addEventListener('click', () => {
        this.emitter.emit('product:remove_from_cart', item.id);
      });

      list.appendChild(itemNode);
    });

    const priceElement = cartFragment.querySelector('.basket__price');
    const total = data.reduce((sum, item) => sum + item.price, 0);
    if (priceElement) priceElement.textContent = `${total} синапсов`;

    const orderButton = cartFragment.querySelector('[data-order]');
    orderButton?.addEventListener('click', () => {
      this.emitter.emit('order:open_payment_form');
    });

    // Делаем кнопку "Оформить" неактивной, если корзина пуста
    if (orderButton) {
      if (data.length === 0) {
        orderButton.setAttribute('disabled', 'disabled');
        orderButton.classList.add('button_disabled');
      } else {
        orderButton.removeAttribute('disabled');
        orderButton.classList.remove('button_disabled');
      }
    }

    return cartFragment;
  }

  clear(): void {
    if (this.container) this.container.innerHTML = '';
  }
}
