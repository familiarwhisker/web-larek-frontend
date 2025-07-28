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
  private action?: (event: MouseEvent) => void;

  private _id: string = '';

  constructor(template: HTMLTemplateElement, emitter: EventEmitter, action?: (event: MouseEvent) => void) {
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
    this.action = action;

    this.element.addEventListener('click', () => {
      this.emitter.emit('product:select', this._id);
    });

    if (this.action) {
      this.addButton?.addEventListener('click', this.action);
    }

    this.deleteButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emitter.emit('product:remove_from_cart', this._id);
    });
  }

  render(product: IProduct, cardType: 'catalog' | 'preview' | 'cart' = 'catalog', buttonState?: 'remove' | 'buy' | 'buy_disabled', index?: number): HTMLElement {
    this._id = product.id;
    switch (cardType) {
      case 'cart':
        this.renderCartCard(product, index);
        break;
      case 'preview':
        this.renderPreviewCard(product, buttonState);
        break;
      case 'catalog':
      default:
        this.renderCatalogCard(product, buttonState);
        break;
    }
    return this.element;
  }

  formatPrice(value: number | null) {
    return value == null ? 'Бесценно' : `${value} синапсов`;
  }

  canBeAddedToCart(product: IProduct): boolean {
    return product.price > 0;
  }

  private setTitleAndPrice(product: IProduct): void {
    if (this.title) this.title.textContent = product.title;
    if (this.price) this.price.textContent = this.formatPrice(product.price);
  }

  private renderCatalogCard(product: IProduct, buttonState?: 'remove' | 'buy' | 'buy_disabled'): void {
    this.setTitleAndPrice(product);
    if (this.category && product.category) {
      this.category.textContent = product.category;
      this.setCategoryClass(product.category);
    }
    if (this.image && product.image) {
      this.image.src = CDN_URL + product.image;
    }
    if (this.addButton && buttonState) {
      if (buttonState === 'remove') {
        this.renderRemoveFromCartButton();
      } else if (buttonState === 'buy') {
        this.renderAddToCartButton();
      } else if (buttonState === 'buy_disabled') {
        this.renderDisabledBuyButton();
      }
    }
  }

  private renderPreviewCard(product: IProduct, buttonState?: 'remove' | 'buy' | 'buy_disabled'): void {
    this.setTitleAndPrice(product);
    if (this.category && product.category) {
      this.category.textContent = '';
      this.category.textContent = product.category;
      this.setCategoryClass(product.category);
    }
    if (this.image && product.image) {
      this.image.src = CDN_URL + product.image;
    }
    if (this.description) {
      this.description.textContent = '';
      if (product.description) {
        this.description.textContent = product.description;
      }
    }
    if (this.addButton && buttonState) {
      if (buttonState === 'remove') {
        this.renderRemoveFromCartButton();
      } else if (buttonState === 'buy') {
        this.renderAddToCartButton();
      } else if (buttonState === 'buy_disabled') {
        this.renderDisabledBuyButton();
      }
    }
  }

  private renderCartCard(product: IProduct, index?: number): void {
    this.setTitleAndPrice(product);
    if (index !== undefined) {
      const indexElement = this.element.querySelector('.basket__item-index');
      if (indexElement) {
        indexElement.textContent = (index + 1).toString();
      }
    }
  }

  private renderRemoveFromCartButton(): void {
    this.enableButton('Удалить из корзины');
  }

  private renderDisabledBuyButton(): void {
    this.disableButton('Недоступно');
  }

  private renderAddToCartButton(): void {
    this.enableButton('В корзину');
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
