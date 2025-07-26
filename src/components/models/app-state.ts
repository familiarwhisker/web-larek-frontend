import { ICartItem } from "../../types/cart";
import { IProduct } from "../../types/product";
import { EventEmitter } from "../base/event-emitter";
import Api, { ApiListResponse } from "../base/api";

export class AppState {
  private products: IProduct[] = [];
  private cartItems: ICartItem[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private emitter: EventEmitter, private api: Api) {
    this.loadProducts();
  }

  private loadProducts() {
    this.api.get<ApiListResponse<IProduct>>('/product/')
      .then((response) => {
        this.products = response.items;
        this.emitter.emit('products:loaded', this.products);
      })
      .catch((error) => {
        this.emitter.emit('products:error', error);
      });
  }

  selectProduct(product_id: string) {
    this.selectedProduct = this.products.find(p => p.id === product_id) || null;
    if (this.selectedProduct) {
      this.emitter.emit('preview:change', this.selectedProduct);
    }
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  getCartItems(): ICartItem[] {
    return this.cartItems;
  }

  isProductInCart(productId: string): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  addProductToCart(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.emitter.emit('cart:updated', this.cartItems);
    this.emitter.emit('cart_counter:render', this.cartItems.length);
  }

  removeProductFromCart(productId: string) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    }

    this.emitter.emit('cart:updated', this.cartItems);
    this.emitter.emit('cart_counter:render', this.cartItems.length);
  }

  getCartItemsCount(): number {
    return this.cartItems.length;
  }
}
