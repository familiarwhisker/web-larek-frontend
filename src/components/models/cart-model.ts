import { ICartItem } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class CartModel {
  private items: ICartItem[] = [];

  constructor(private emitter: EventEmitter) {}

  addProduct(product: ICartItem['product']) {
    const item = this.items.find(i => i.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  }

  removeProduct(product: ICartItem['product']) {
    const productId = product.id;
    const item = this.items.find(i => i.product.id === productId);

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.items = this.items.filter(i => i.product.id !== productId);
    }
  }

  getItems(): ICartItem[] {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}
