import { IProduct, IView } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class ProductCardView implements IView<IProduct[]> {
  constructor(private container: HTMLElement, private emitter: EventEmitter) {}

  render(data: IProduct[]): void {
    console.log('Render all products:', data);

    this.container.innerHTML = '';

    data.forEach((product) => {
      const item = document.createElement('div');
      item.classList.add('product-card');
      item.textContent = product.title;
      item.addEventListener('click', () => {
        this.emitter.emit('product:select', product);
      });
      this.container.append(item);
    });
  }
}
