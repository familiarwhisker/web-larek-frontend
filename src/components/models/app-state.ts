import { IProduct } from "../../types";
import { EventEmitter } from "../base/event-emitter";
import Api, { ApiListResponse } from "../base/api";
import { API_URL } from "../../utils/constants";

export class AppState {
  private _products: IProduct[] = [];
  private _cartItems: IProduct[] = [];
  private _selectedProductId: string | null = null;
  private _modalState: 'cart' | 'product_preview' | 'payment' | 'contacts' | 'success' | null = null;
  private api: Api;
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.api = new Api(API_URL);
  }

  set products(value: IProduct[]) {
    this._products = value;
    this.emitter.emit('products:loaded');
  }

  get products(): IProduct[] {
    return this._products;
  }

  set cartItems(value: IProduct[]) {
    this._cartItems = value;
  }

  get cartItems(): IProduct[] {
    return this._cartItems;
  }

  set selectedProductId(value: string) {
    this._selectedProductId = value;
    const product = this.products.find(p => p.id === value);
    this.emitter.emit('product:show_preview', product);
  }

  get selectedProductId(): string | null {
    return this._selectedProductId;
  }

  set modalState(value: 'cart' | 'product_preview' | 'payment' | 'contacts' | 'success' | null) {
    this._modalState = value;
  }

  get modalState(): 'cart' | 'product_preview' | 'payment' | 'contacts' | 'success' | null {
    return this._modalState;
  }

  loadProducts(): Promise<void> {
    return this.api.get<ApiListResponse<IProduct>>('/product/')
      .then((response) => {
        this.products = response.items;
      })
      .catch((error) => {
        this.emitter.emit('products:loading_error', error);
      });
  }

  isProductInCart(productId: string): boolean {
    return this.cartItems.some(item => item.id === productId);
  }

  addProductToCart(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      console.log('Товар не найден', productId);
      return;
    }

    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      console.log('Этот товар уже в корзине', item);
    } else {
      this.cartItems.push(product);
    }

    this.emitter.emit('cart:render_counter', this.cartItems.length);
  }

  removeProductFromCart(productId: string) {
    const item = this.cartItems.find(i => i.id === productId);
    if (!item) {
      console.log('Товар не найден', productId);
      return;
    }

    this.cartItems = this.cartItems.filter(i => i.id !== productId);

    this.emitter.emit('cart:render_counter', this.cartItems.length);
  }

  getCartItemsCount(): number {
    return this.cartItems.length;
  }

  getCartTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.emitter.emit('cart:render_counter', 0);
  }

  isShowingCart(): boolean {
    return this._modalState === 'cart';
  }

  isShowingProductPreview(): boolean {
    return this._modalState === 'product_preview';
  }
}
