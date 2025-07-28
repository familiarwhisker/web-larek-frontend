import { EventEmitter } from '../base/event-emitter';

export class ModalView {
  private content: HTMLElement;
  private closeButton: HTMLElement;
  private emitter: EventEmitter;

  constructor(private container: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;

    this.content = container.querySelector('.modal__content')!;
    this.closeButton = container.querySelector('.modal__close')!;

    this.closeButton.addEventListener('click', () => {
      this.emitter.emit('modal:close');
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.emitter.emit('modal:close');
      }
    });

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
