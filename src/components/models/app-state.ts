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
  }

  addProductToCart(product_id: string) {
    const product = this.products.find(p => p.id === product_id);
    if (!product) return;

    const item = this.cartItems.find(i => i.product.id === product.id);
    if (item) {
      item.quantity++;
      this.emitter.emit('cart:render', this.cartItems);
    } else {
      this.cartItems.push({ product, quantity: 1 });
      this.emitter.emit('cart:render', this.cartItems);
      this.emitter.emit('modal:close');
    }
    this.emitter.emit('cart:render', this.cartItems);
    this.emitter.emit('cart_counter:render', this.cartItems.length);
    this.emitter.emit('modal:close');
  }

  removeProductFromCart(product: ICartItem['product']) {
    const productId = product.id;
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    }
    this.emitter.emit('cart:render', this.cartItems);
    this.emitter.emit('cart_counter:render', this.cartItems.length);
  }

  getCartItems(): ICartItem[] {
    return this.cartItems;
  }
}
