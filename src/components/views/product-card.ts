import { IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';
import { CDN_URL } from '../../utils/constants';

export class ProductCardView {
  private element: HTMLElement;
  private addButton: HTMLButtonElement | null = null;

  constructor(
    private product: IProduct,
    private template: HTMLTemplateElement,
    private emitter: EventEmitter,
    private inCart: boolean = false // новый параметр
  ) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Заполнение базовых полей
    const title = this.element.querySelector('.card__title');
    if (title) title.textContent = product.title;

    const price = this.element.querySelector('.card__price');
    const isPriceless = product.price == null || product.price === 0;
    if (price) {
      price.textContent = isPriceless ? 'Бесценно' : `${product.price} синапсов`;
    }

    const category = this.element.querySelector('.card__category');
    if (category) category.textContent = product.category;

    const img = this.element.querySelector('.card__image') as HTMLImageElement;
    if (img) {
      img.src = product.image.startsWith('/') ? CDN_URL + product.image : product.image;
    }

    // Общий клик по карточке (открытие модалки)
    this.element.addEventListener('click', () => {
      this.emitter.emit('product:select', this.product.id);
    });

    // Добавить в корзину (только для preview-карточки)
    this.addButton = this.element.querySelector('.card__button');
    if (this.addButton && this.element.classList.contains('card_full')) {
      if (isPriceless) {
        const unavailableBtn = this.addButton.cloneNode(true) as HTMLButtonElement;
        unavailableBtn.textContent = 'Недоступно';
        unavailableBtn.disabled = true;
        unavailableBtn.classList.add('button_disabled');
        this.addButton.replaceWith(unavailableBtn);
        this.addButton = null;
      } else if (this.inCart) {
        this.addButton.textContent = 'Удалить из корзины';
        this.addButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.emitter.emit('cart:remove', this.product.id);
        });
      } else {
        this.addButton.textContent = 'В корзину';
        this.addButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.emitter.emit('cart:add', this.product.id);
        });
      }
    } else if (this.addButton) {
      this.addButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emitter.emit('cart:add', this.product.id);
      });
    }

    // Удалить из корзины (только для basket-карточки)
    const deleteButton = this.element.querySelector('.basket__item-delete');
    if (deleteButton) {
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emitter.emit('cart:remove', this.product.id);
      });
    }
  }

  render(): HTMLElement {
    return this.element;
  }
}
