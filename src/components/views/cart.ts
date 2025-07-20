import { ICartItem } from '../../types';
import { IView } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class CartView implements IView<ICartItem[]> {
  constructor(private container: HTMLElement, private emitter: EventEmitter) {}

  render(data: ICartItem[]): void {
    // Example render logic (placeholder)
    console.log('Rendering cart items:', data);
  }

  clear(): void {
    // Clear cart view
    console.log('Cart view cleared');
  }
}
