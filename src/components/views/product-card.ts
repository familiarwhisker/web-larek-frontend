import { IProduct } from '../../types';
import { EventEmitter } from '../base/event-emitter';
import { CDN_URL } from '../../utils/constants';

export class ProductCardView {
  private template: HTMLTemplateElement;
  private element: HTMLElement;
  private title: HTMLTitleElement;
  private price: HTMLParagraphElement;
  private category: HTMLParagraphElement;
  private image: HTMLImageElement;
  private description: HTMLParagraphElement | null = null;
  private addButton: HTMLButtonElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;
  private emitter: EventEmitter;

  private _id: string = '';
  private _isInCart: boolean = false;

  constructor(template: HTMLTemplateElement, emitter: EventEmitter) {
    this.emitter = emitter;

    this.template = template;

    this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.title = this.element.querySelector('.card__title') as HTMLTitleElement;
    this.price = this.element.querySelector('.card__price') as HTMLParagraphElement;
    this.category = this.element.querySelector('.card__category') as HTMLParagraphElement;
    this.image = this.element.querySelector('.card__image') as HTMLImageElement;
    this.description = this.element.querySelector('.card__text');
    this.deleteButton = this.element.querySelector('.basket__item-delete');
    this.addButton = this.element.querySelector('.card__button');

    this.element.addEventListener('click', () => {
      this.emitter.emit('product:select', this._id);
    });

    // Обработчик для кнопки добавления/удаления из корзины
    this.addButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      // Определяем, какое событие эмитить, в зависимости от состояния товара
      // Это будет обновляться в методе render
      if (this._isInCart) {
        this.emitter.emit('product:remove_from_cart', this._id);
      } else {
        this.emitter.emit('product:add_to_cart', this._id);
      }
    });

    this.deleteButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emitter.emit('product:remove_from_cart', this._id);
    });
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  render(product: IProduct, isInCart: boolean): HTMLElement {
    this.id = product.id;
    this._isInCart = isInCart; // Сохраняем состояние товара в корзине
    this.title.textContent = product.title;
    this.price.textContent = this.formatPrice(product.price);
    this.category.textContent = product.category;
    this.image.src = CDN_URL + product.image;

    // Устанавливаем правильный класс для категории
    this.setCategoryClass(product.category);

    // Устанавливаем описание, если элемент существует
    if (this.description) {
      this.description.textContent = product.description;
    }

    if (this.addButton) {
      this.updateButtonState(product, isInCart);
    }

    return this.element;
  }

  formatPrice(value: number | null) {
    return value == null ? 'Бесценно' : `${value} синапсов`;
  }

  canBeAddedToCart(product: IProduct): boolean {
    return product.price > 0;
  }

  private updateButtonState(product: IProduct, isInCart: boolean): void {
    if (isInCart) {
      this.setRemoveFromCartButton();
    } else {
      this.setAddToCartButton(product);
    }
  }

  private setAddToCartButton(product: IProduct): void {
    if (this.canBeAddedToCart(product)) {
      this.enableButton('В корзину');
    } else {
      this.disableButton('Недоступно');
    }
  }

  private setRemoveFromCartButton(): void {
    this.enableButton('Удалить из корзины');
  }

  private enableButton(text: string): void {
    if (!this.addButton) return;

    this.addButton.textContent = text;
    this.addButton.disabled = false;
    this.addButton.classList.remove('button_disabled');
  }

  private disableButton(text: string): void {
    if (!this.addButton) return;

    this.addButton.textContent = text;
    this.addButton.disabled = true;
    this.addButton.classList.add('button_disabled');
  }

    private setCategoryClass(category: string): void {
    const categoryClassMap = new Map<string, string>([
      ['софт-скил', 'card__category_soft'],
      ['хард-скил', 'card__category_hard'],
      ['другое', 'card__category_other'],
      ['дополнительное', 'card__category_additional'],
      ['кнопка', 'card__category_button']
    ]);

    const categoryClass = categoryClassMap.get(category);

    // Устанавливаем правильный класс или базовый, если категория не найдена
    this.category.className = categoryClass
      ? `card__category ${categoryClass}`
      : 'card__category';
  }
}
