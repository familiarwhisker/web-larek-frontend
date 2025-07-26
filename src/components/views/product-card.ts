import { IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';

export class ProductCardView {
  private element: HTMLElement;

  constructor(
    private product: IProduct,
    private template: HTMLTemplateElement,
    private emitter: EventEmitter
  ) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Заполнение базовых полей
    const title = this.element.querySelector('.card__title');
    if (title) title.textContent = product.title;

    const price = this.element.querySelector('.card__price');
    if (price) price.textContent = `${product.price} синапсов`;

    const category = this.element.querySelector('.card__category');
    if (category) category.textContent = product.category;

    const img = this.element.querySelector('.card__image') as HTMLImageElement;
    if (img) img.src = product.image;

    // Общий клик по карточке (открытие модалки)
    this.element.addEventListener('click', () => {
      this.emitter.emit('product:select', this.product.id);
    });

    // Добавить в корзину (только для preview-карточки)
    const addButton = this.element.querySelector('.card__button');
    if (addButton) {
      addButton.addEventListener('click', (e) => {
        e.stopPropagation(); // не открывать модалку повторно
        this.emitter.emit('cart:add', product);
      });
    }

    // Удалить из корзины (только для basket-карточки)
    const deleteButton = this.element.querySelector('.basket__item-delete');
    if (deleteButton) {
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emitter.emit('cart:remove', product);
      });
    }
  }

  render(): HTMLElement {
    return this.element;
  }
}
