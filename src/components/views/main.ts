import { EventEmitter } from '../base/event-emitter';

export class MainView {
  private emitter: EventEmitter;
  private gallery: HTMLElement;
  private cartButton: HTMLButtonElement;
  private counter: HTMLElement;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.gallery = document.querySelector('.gallery')!;
    this.cartButton = document.querySelector('.header__basket')!;
    this.counter = this.cartButton.querySelector('.header__basket-counter')!;

    this.cartButton.addEventListener('click', () => {
      this.emitter.emit('cart:open_modal');
    });
  }

  render(cards: HTMLElement[]): void {
    this.gallery.replaceChildren(...cards);
  }

  updateCounter(count: number): void {
    this.counter.textContent = String(count);
  }
}
