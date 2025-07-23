import { IProduct, IEvent, AppEvents } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class ProductModel {
  private products: IProduct[] = [];

  constructor(private emitter: EventEmitter) {}

  // Save product list
  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  // Find product by ID
  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  // Emit product selection
  selectProduct(id: string): void {
    const product = this.getProductById(id);
    if (product) {
      this.emitter.emit('preview:change', product);
    }
  }
}
