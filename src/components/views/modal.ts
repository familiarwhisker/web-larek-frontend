import { EventEmitter } from '../base/event-emitter';

export class ModalView {
  private content: HTMLElement;
  private closeButton: HTMLElement;
  private scrollY = 0;

  constructor(private container: HTMLElement, private emitter: EventEmitter) {
    this.content = container.querySelector('.modal__content')!;
    this.closeButton = container.querySelector('.modal__close')!;

    // Закрытие по кнопке
    this.closeButton.addEventListener('click', () => {
      this.emitter.emit('modal:close');
    });

    // Закрытие по клику за пределами модалки
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.emitter.emit('modal:close');
      }
    });

    // Закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
        this.emitter.emit('modal:close');
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }

  render(content: HTMLElement): void {
    this.content.replaceChildren(content);
  }
}
