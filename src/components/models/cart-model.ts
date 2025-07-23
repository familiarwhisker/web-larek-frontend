import { ICartItem, IProduct } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class CartModel {
  private items: ICartItem[] = [];

  constructor(private emitter: EventEmitter) {}

  addProduct(product: ICartItem['product']) {
    const item = this.items.find(i => i.product.id === product.id);
    if (item) {
      item.quantity++;

      this.emitter.emit('cart:render', this.items);
    } else {
      this.items.push({ product, quantity: 1 });

      this.emitter.emit('cart:render', this.items);
      this.emitter.emit('modal:close');
    }

    this.emitter.emit('cart:render', this.items);
    this.emitter.emit('cart_counter:render', this.items.length);
    this.emitter.emit('modal:close');
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

    this.emitter.emit('cart:render', this.items);
    this.emitter.emit('cart_counter:render', this.items.length);
  }

  getItems(): ICartItem[] {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}
