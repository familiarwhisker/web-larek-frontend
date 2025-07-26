import { EventEmitter } from '../base/event-emitter';

export class MainView {
  private gallery: HTMLElement;
  private basketButton: HTMLButtonElement;
  private counter: HTMLElement;

  constructor(private emitter: EventEmitter) {
    this.gallery = document.querySelector('.gallery')!;
    this.basketButton = document.querySelector('.header__basket')!;
    this.counter = this.basketButton.querySelector('.header__basket-counter')!;

    // Открытие корзины по кнопке
    this.basketButton.addEventListener('click', () => {
      this.emitter.emit('cart:open_modal');
    });
  }

  // Рендерит карточки в галерею
  render(cards: HTMLElement[]): void {
    this.gallery.replaceChildren(...cards);
  }

  // Обновляет счётчик товаров в корзине
  updateCounter(count: number): void {
    this.counter.textContent = String(count);
  }
}
