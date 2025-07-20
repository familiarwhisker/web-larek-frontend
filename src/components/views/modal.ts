import { IProduct } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class ModalView {
  constructor(private container: HTMLElement, private emitter: EventEmitter) {}

  open() { /* ... */ }
  close() { /* ... */ }

  render(product: IProduct): void {
    console.log('Render modal with product', product);
    this.container.addEventListener('click', () => {
      this.emitter.emit('cart:add', product);
    });
  }
}
