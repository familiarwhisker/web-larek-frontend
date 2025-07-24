import { IProduct, IEvent, AppEvents } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class ProductModel {
  private products: IProduct[] = [];

  constructor(private emitter: EventEmitter) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  selectProduct(id: string): void {
    const product = this.getProductById(id);
    if (product) {
      this.emitter.emit('preview:change', product);
    }
  }
}
